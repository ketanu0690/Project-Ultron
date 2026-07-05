import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AgentMemory,
  AgentMemoryMetadata,
  ApiResponse,
  MemorySearchRequest,
  MemorySearchResult,
} from '@ultron/shared';
import { Prisma } from '@prisma/client';

import { toAgentMemory } from '../../common/mappers/entity.mappers';
import { createApiResponse } from '../../common/utils/api-response.util';
import { slugOrUuidWhere } from '../../common/utils/entity-ref.util';
import { PrismaService } from '../../common/prisma/prisma.service';
import { EmbeddingService } from '../ai/embedding.service';
import { ModelRouterService } from '../ai/model-router.service';
import { MemoryRetrieverService } from '../ai/memory-retriever.service';

const NOT_DELETED = { deletedAt: null } as const;
const REFLECTION_EPISODIC_THRESHOLD = 10;
const DEFAULT_SEARCH_LIMIT = 5;
const MAX_SEARCH_LIMIT = 20;

@Injectable()
export class MemoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
    private readonly memoryRetriever: MemoryRetrieverService,
    private readonly modelRouter: ModelRouterService,
  ) {}

  async findByAgent(agentId: string): Promise<ApiResponse<AgentMemory[]>> {
    const agent = await this.resolveAgent(agentId);

    const records = await this.prisma.agentMemory.findMany({
      where: { agentId: agent.id, ...NOT_DELETED },
      orderBy: { createdAt: 'desc' },
    });

    return createApiResponse(records.map(toAgentMemory));
  }

  async search(
    agentId: string,
    request: MemorySearchRequest,
  ): Promise<ApiResponse<MemorySearchResult[]>> {
    const agent = await this.resolveAgent(agentId);
    const query = request.query.trim();

    if (query.length === 0) {
      throw new BadRequestException('Search query must not be empty');
    }

    const limit = Math.min(
      Math.max(request.limit ?? DEFAULT_SEARCH_LIMIT, 1),
      MAX_SEARCH_LIMIT,
    );

    const matches = await this.memoryRetriever.searchSemantic(
      agent.id,
      query,
      limit,
    );

    const records = await this.prisma.agentMemory.findMany({
      where: {
        id: { in: matches.map((match) => match.id) },
        agentId: agent.id,
        deletedAt: null,
      },
      select: {
        id: true,
        agentId: true,
        type: true,
        content: true,
        metadata: true,
        createdAt: true,
      },
    });

    const recordById = new Map(records.map((record) => [record.id, record]));
    const similarityById = new Map(
      matches.map((match) => [match.id, match.similarity ?? 0]),
    );

    const results: MemorySearchResult[] = matches
      .map((match) => {
        const record = recordById.get(match.id);
        if (!record) {
          return null;
        }

        return {
          id: record.id,
          agentId: record.agentId,
          type: record.type,
          content: record.content,
          similarity: similarityById.get(record.id) ?? 0,
          metadata:
            typeof record.metadata === 'object' && record.metadata !== null
              ? (record.metadata as MemorySearchResult['metadata'])
              : {},
          createdAt: record.createdAt.toISOString(),
        };
      })
      .filter((result): result is MemorySearchResult => result !== null);

    return createApiResponse(results);
  }

  async storeDialogueTurn(input: {
    agentId: string;
    sessionId: string;
    userMessage: string;
    agentResponse: string;
  }): Promise<void> {
    const content = [
      `Session: ${input.sessionId}`,
      `Visitor: ${input.userMessage}`,
      `Agent: ${input.agentResponse}`,
    ].join('\n');

    await this.createMemoryWithEmbedding({
      agentId: input.agentId,
      type: 'episodic',
      content,
      metadata: {
        source: 'dialogue',
        tags: ['user-dialogue'],
      },
    });

    await this.maybeReflect(input.agentId);
  }

  private async createMemoryWithEmbedding(input: {
    agentId: string;
    type: 'episodic' | 'semantic';
    content: string;
    metadata: AgentMemoryMetadata;
  }): Promise<void> {
    const record = await this.prisma.agentMemory.create({
      data: {
        agentId: input.agentId,
        type: input.type,
        content: input.content,
        metadata: input.metadata as Prisma.InputJsonValue,
      },
    });

    const embedding = await this.embeddingService.embed(input.content);
    const vectorLiteral = this.embeddingService.toPgVectorLiteral(embedding);

    await this.prisma.$executeRaw(
      Prisma.sql`
        UPDATE agent_memories
        SET embedding = ${vectorLiteral}::vector
        WHERE id = ${record.id}::uuid
      `,
    );
  }

  private async maybeReflect(agentId: string): Promise<void> {
    const episodicCount = await this.prisma.agentMemory.count({
      where: {
        agentId,
        type: 'episodic',
        deletedAt: null,
      },
    });

    if (
      episodicCount === 0 ||
      episodicCount % REFLECTION_EPISODIC_THRESHOLD !== 0
    ) {
      return;
    }

    const recentEpisodic = await this.prisma.agentMemory.findMany({
      where: {
        agentId,
        type: 'episodic',
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      take: REFLECTION_EPISODIC_THRESHOLD,
      select: { content: true },
    });

    if (recentEpisodic.length === 0) {
      return;
    }

    const synthesisPrompt = [
      'Summarize the following episodic memories into one concise semantic belief.',
      'Focus on durable facts, preferences, and relationships.',
      '',
      ...recentEpisodic.map(
        (memory, index) => `${String(index + 1)}. ${memory.content}`,
      ),
    ].join('\n');

    let semanticContent = '';
    for await (const chunk of this.modelRouter.streamCompletion({
      agentId,
      agentName: 'Reflection',
      agentRole: 'archivist',
      message: synthesisPrompt,
    })) {
      semanticContent += chunk.token ?? '';
      if (chunk.done) {
        break;
      }
    }

    const trimmed = semanticContent.trim();
    if (trimmed.length === 0) {
      return;
    }

    await this.createMemoryWithEmbedding({
      agentId,
      type: 'semantic',
      content: trimmed,
      metadata: {
        source: 'reflection',
        tags: ['reflection-source'],
        confidence: 0.75,
      },
    });
  }

  private async resolveAgent(agentId: string): Promise<{ id: string }> {
    const agent = await this.prisma.agent.findFirst({
      where: {
        ...slugOrUuidWhere(agentId),
        ...NOT_DELETED,
      },
      select: { id: true },
    });

    if (!agent) {
      throw new NotFoundException(`Agent '${agentId}' not found`);
    }

    return agent;
  }
}
