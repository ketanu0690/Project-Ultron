import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../common/prisma/prisma.service';
import { AgentsService } from './agents.service';

const agentRecord = {
  id: '00000000-0000-4000-8000-000000000020',
  slug: 'agent-sigma-7',
  name: 'Sigma-7',
  role: 'planner' as const,
  homeDistrictId: '00000000-0000-4000-8000-000000000003',
  homeBuildingId: '00000000-0000-4000-8000-000000000010',
  homeRoomId: '00000000-0000-4000-8000-000000000030',
  model: 'claude-sonnet-4',
  version: '1.0.0',
  status: 'idle' as const,
  capabilities: ['planning'],
  createdAt: new Date('2026-06-14T12:00:00.000Z'),
  updatedAt: new Date('2026-06-14T12:00:00.000Z'),
  deletedAt: null,
};

describe('AgentsService', () => {
  let service: AgentsService;
  let prisma: {
    district: {
      findFirst: jest.Mock;
    };
    agent: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      district: {
        findFirst: jest.fn(),
      },
      agent: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AgentsService>(AgentsService);
  });

  it('findAll returns paginated agents with meta', async () => {
    prisma.district.findFirst.mockResolvedValue({
      id: agentRecord.homeDistrictId,
    });
    prisma.agent.findMany.mockResolvedValue([agentRecord]);
    prisma.agent.count.mockResolvedValue(50);

    const result = await service.findAll({
      district: 'reasoning',
      page: 1,
      pageSize: 50,
    });

    expect(prisma.agent.findMany).toHaveBeenCalledWith({
      where: {
        deletedAt: null,
        homeDistrictId: agentRecord.homeDistrictId,
      },
      orderBy: { slug: 'asc' },
      skip: 0,
      take: 50,
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].slug).toBe('agent-sigma-7');
    expect(result.meta).toEqual({ page: 1, pageSize: 50, total: 50 });
    expect(result.timestamp).toBeDefined();
  });

  it('findAll filters by status', async () => {
    prisma.agent.findMany.mockResolvedValue([]);
    prisma.agent.count.mockResolvedValue(0);

    await service.findAll({ status: 'thinking', page: 1, pageSize: 20 });

    expect(prisma.agent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          deletedAt: null,
          status: 'thinking',
        },
      }),
    );
  });

  it('findAll returns empty page when district slug is unknown', async () => {
    prisma.district.findFirst.mockResolvedValue(null);
    prisma.agent.findMany.mockResolvedValue([]);
    prisma.agent.count.mockResolvedValue(0);

    const result = await service.findAll({
      district: 'reasoning',
      page: 1,
      pageSize: 50,
    });

    expect(result.data).toEqual([]);
    expect(result.meta?.total).toBe(0);
  });

  it('findById returns an agent wrapped in ApiResponse', async () => {
    prisma.agent.findFirst.mockResolvedValue(agentRecord);

    const result = await service.findById(agentRecord.id);

    expect(result.data.slug).toBe('agent-sigma-7');
    expect(result.data.capabilities).toEqual(['planning']);
  });

  it('findById throws NotFoundException when agent is missing', async () => {
    prisma.agent.findFirst.mockResolvedValue(null);

    await expect(service.findById(agentRecord.id)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('getStatus returns agent status payload', async () => {
    prisma.agent.findFirst.mockResolvedValue({
      id: agentRecord.id,
      status: 'idle',
    });

    const result = await service.getStatus(agentRecord.id);

    expect(result.data).toEqual({
      agentId: agentRecord.id,
      status: 'idle',
    });
  });
});
