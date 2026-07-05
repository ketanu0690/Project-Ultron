import { Injectable } from '@nestjs/common';
import type { MemoryType } from '@ultron/shared';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { EmbeddingService } from './embedding.service';

export interface RetrievedMemory {
  id: string;
  type: MemoryType;
  content: string;
  similarity?: number;
}

const EPISODIC_RECENCY_LIMIT = 10;
const SEMANTIC_SIMILARITY_LIMIT = 5;

@Injectable()
export class MemoryRetrieverService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async retrieve(agentId: string, query: string): Promise<RetrievedMemory[]> {
    const [semantic, episodic] = await Promise.all([
      this.searchSemantic(agentId, query, SEMANTIC_SIMILARITY_LIMIT),
      this.recentEpisodic(agentId, EPISODIC_RECENCY_LIMIT),
    ]);

    const seen = new Set<string>();
    const merged: RetrievedMemory[] = [];

    for (const memory of [...semantic, ...episodic]) {
      if (seen.has(memory.id)) {
        continue;
      }
      seen.add(memory.id);
      merged.push(memory);
    }

    return merged;
  }

  async searchSemantic(
    agentId: string,
    query: string,
    limit: number,
  ): Promise<RetrievedMemory[]> {
    const vector = await this.embeddingService.embed(query);
    const vectorLiteral = this.embeddingService.toPgVectorLiteral(vector);

    const rows = await this.prisma.$queryRaw<
      Array<{
        id: string;
        type: MemoryType;
        content: string;
        similarity: number;
      }>
    >(
      Prisma.sql`
        SELECT
          id,
          type,
          content,
          1 - (embedding <=> ${vectorLiteral}::vector) AS similarity
        FROM agent_memories
        WHERE agent_id = ${agentId}::uuid
          AND deleted_at IS NULL
          AND embedding IS NOT NULL
        ORDER BY embedding <=> ${vectorLiteral}::vector
        LIMIT ${limit}
      `,
    );

    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      content: row.content,
      similarity: Number(row.similarity),
    }));
  }

  private async recentEpisodic(
    agentId: string,
    limit: number,
  ): Promise<RetrievedMemory[]> {
    const records = await this.prisma.agentMemory.findMany({
      where: {
        agentId,
        type: 'episodic',
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, type: true, content: true },
    });

    return records.map((record) => ({
      id: record.id,
      type: record.type,
      content: record.content,
    }));
  }
}
