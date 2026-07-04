import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../common/prisma/prisma.service';
import { MemoryService } from './memory.service';

describe('MemoryService', () => {
  let service: MemoryService;
  let prisma: {
    agent: { findFirst: jest.Mock };
    agentMemory: { findMany: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      agent: { findFirst: jest.fn() },
      agentMemory: { findMany: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MemoryService, { provide: PrismaService, useValue: prisma }],
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
});
