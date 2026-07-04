import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../common/prisma/prisma.service';
import { DistrictsService } from './districts.service';

const reasoningDistrict = {
  id: '00000000-0000-4000-8000-000000000003',
  slug: 'reasoning',
  name: 'Reasoning District',
  themeConfig: {
    primary: '#6366f1',
    secondary: '#818cf8',
    accent: '#a5b4fc',
  },
  agentCount: 50,
  metrics: { throughput: 1200 },
  createdAt: new Date('2026-06-14T12:00:00.000Z'),
  updatedAt: new Date('2026-06-14T12:00:00.000Z'),
  deletedAt: null,
};

describe('DistrictsService', () => {
  let service: DistrictsService;
  let prisma: {
    district: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
    };
    building: {
      findMany: jest.Mock;
      count: jest.Mock;
    };
    agent: {
      findMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      district: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
      },
      building: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      agent: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DistrictsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<DistrictsService>(DistrictsService);
  });

  it('findAll returns districts wrapped in ApiResponse', async () => {
    prisma.district.findMany.mockResolvedValue([reasoningDistrict]);

    const result = await service.findAll();

    expect(prisma.district.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      orderBy: { slug: 'asc' },
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].slug).toBe('reasoning');
    expect(result.data[0].themeConfig.primary).toBe('#6366f1');
    expect(result.timestamp).toBeDefined();
  });

  it('findById returns a district by slug', async () => {
    prisma.district.findFirst.mockResolvedValue(reasoningDistrict);

    const result = await service.findById('reasoning');

    expect(prisma.district.findFirst).toHaveBeenCalledWith({
      where: { slug: 'reasoning', deletedAt: null },
    });
    expect(result.data.slug).toBe('reasoning');
    expect(result.data.agentCount).toBe(50);
  });

  it('findById throws NotFoundException when district is missing', async () => {
    prisma.district.findFirst.mockResolvedValue(null);

    await expect(service.findById('reasoning')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findBuildings returns buildings for a district', async () => {
    prisma.district.findFirst.mockResolvedValue({ id: reasoningDistrict.id });
    prisma.building.findMany.mockResolvedValue([
      {
        id: '00000000-0000-4000-8000-000000000010',
        slug: 'building-planning-tower',
        districtId: reasoningDistrict.id,
        buildingType: 'planning_tower',
        name: 'Planning Tower',
        state: 'active',
        detailLevel: 'full',
        position: { x: 0, y: 40, z: 0 },
        capacity: { maxAgents: 100 },
        metrics: { utilization: 0.35 },
        createdAt: new Date('2026-06-14T12:00:00.000Z'),
        updatedAt: new Date('2026-06-14T12:00:00.000Z'),
        deletedAt: null,
      },
    ]);

    const result = await service.findBuildings('reasoning');

    expect(prisma.building.findMany).toHaveBeenCalledWith({
      where: { districtId: reasoningDistrict.id, deletedAt: null },
      orderBy: { slug: 'asc' },
    });
    expect(result.data).toHaveLength(1);
    expect(result.data[0].slug).toBe('building-planning-tower');
  });

  it('findAgents returns agents for a district', async () => {
    prisma.district.findFirst.mockResolvedValue({ id: reasoningDistrict.id });
    prisma.agent.findMany.mockResolvedValue([
      {
        id: '00000000-0000-4000-8000-000000000020',
        slug: 'agent-sigma-7',
        name: 'Sigma-7',
        role: 'planner',
        homeDistrictId: reasoningDistrict.id,
        homeBuildingId: '00000000-0000-4000-8000-000000000010',
        homeRoomId: null,
        model: 'claude-sonnet-4',
        version: '1.0.0',
        status: 'idle',
        capabilities: [],
        createdAt: new Date('2026-06-14T12:00:00.000Z'),
        updatedAt: new Date('2026-06-14T12:00:00.000Z'),
        deletedAt: null,
      },
    ]);

    const result = await service.findAgents('reasoning');

    expect(result.data).toHaveLength(1);
    expect(result.data[0].slug).toBe('agent-sigma-7');
  });

  it('findMetrics merges stored metrics with counts', async () => {
    prisma.district.findFirst.mockResolvedValue(reasoningDistrict);
    prisma.building.count.mockResolvedValue(10);

    const result = await service.findMetrics('reasoning');

    expect(result.data).toEqual({
      throughput: 1200,
      agentCount: 50,
      buildingCount: 10,
    });
  });
});
