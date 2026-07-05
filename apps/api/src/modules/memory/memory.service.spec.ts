import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { EmbeddingService } from '../ai/embedding.service';
import { MemoryRetrieverService } from '../ai/memory-retriever.service';
import { ModelRouterService } from '../ai/model-router.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { MemoryService } from './memory.service';

describe('MemoryService', () => {
  let service: MemoryService;
  let prisma: {
    agent: { findFirst: jest.Mock };
    agentMemory: {
      findMany: jest.Mock;
      create: jest.Mock;
      count: jest.Mock;
    };
    $executeRaw: jest.Mock;
  };
  let memoryRetriever: { searchSemantic: jest.Mock };
  let embeddingService: { embed: jest.Mock; toPgVectorLiteral: jest.Mock };

  beforeEach(async () => {
    prisma = {
      agent: { findFirst: jest.fn() },
      agentMemory: {
        findMany: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
      },
      $executeRaw: jest.fn().mockResolvedValue(1),
    };
    memoryRetriever = {
      searchSemantic: jest.fn(),
    };
    embeddingService = {
      embed: jest.fn().mockResolvedValue([0.1, 0.2]),
      toPgVectorLiteral: jest.fn().mockReturnValue('[0.1,0.2]'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemoryService,
        { provide: PrismaService, useValue: prisma },
        { provide: EmbeddingService, useValue: embeddingService },
        { provide: MemoryRetrieverService, useValue: memoryRetriever },
        {
          provide: ModelRouterService,
          useValue: {
            streamCompletion: async function* () {
              yield { token: 'summary', done: true };
            },
          },
        },
      ],
    }).compile();

    service = module.get<MemoryService>(MemoryService);
  });

  it('findByAgent returns memories ordered by createdAt desc', async () => {
    prisma.agent.findFirst.mockResolvedValue({ id: 'agent-uuid' });
    prisma.agentMemory.findMany.mockResolvedValue([
      {
        id: 'mem-1',
        agentId: 'agent-uuid',
        type: 'episodic',
        content: 'First memory',
        metadata: {},
        createdAt: new Date('2026-06-14T12:00:00.000Z'),
        expiresAt: null,
        deletedAt: null,
      },
    ]);

    const result = await service.findByAgent('agent-sigma-7');

    expect(prisma.agent.findFirst).toHaveBeenCalledWith({
      where: {
        slug: 'agent-sigma-7',
        deletedAt: null,
      },
      select: { id: true },
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].content).toBe('First memory');
    expect(result.timestamp).toBeDefined();
  });

  it('findByAgent throws NotFoundException when agent is missing', async () => {
    prisma.agent.findFirst.mockResolvedValue(null);

    await expect(service.findByAgent('missing-agent')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('search rejects empty query', async () => {
    prisma.agent.findFirst.mockResolvedValue({ id: 'agent-uuid' });

    await expect(
      service.search('agent-sigma-7', { query: '   ' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('search returns semantic matches with similarity', async () => {
    prisma.agent.findFirst.mockResolvedValue({ id: 'agent-uuid' });
    memoryRetriever.searchSemantic.mockResolvedValue([
      {
        id: 'mem-1',
        type: 'semantic',
        content: 'Sector 7 threat patterns',
        similarity: 0.91,
      },
    ]);
    prisma.agentMemory.findMany.mockResolvedValue([
      {
        id: 'mem-1',
        agentId: 'agent-uuid',
        type: 'semantic',
        content: 'Sector 7 threat patterns',
        metadata: { source: 'reflection' },
        createdAt: new Date('2026-06-14T12:00:00.000Z'),
      },
    ]);

    const result = await service.search('agent-sigma-7', {
      query: 'sector 7 threats',
      limit: 3,
    });

    expect(memoryRetriever.searchSemantic).toHaveBeenCalledWith(
      'agent-uuid',
      'sector 7 threats',
      3,
    );
    expect(result.data[0].similarity).toBe(0.91);
  });
});
