import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../common/prisma/prisma.service';
import { NavigationService } from './navigation.service';

const reasoningDistrict = {
  id: 'district-uuid',
  slug: 'reasoning',
  name: 'Reasoning District',
  themeConfig: { primary: '#6366f1', secondary: '#818cf8', accent: '#a5b4fc' },
  agentCount: 50,
  metrics: { throughput: 1200 },
  createdAt: new Date('2026-06-14T12:00:00.000Z'),
  updatedAt: new Date('2026-06-14T12:00:00.000Z'),
  deletedAt: null,
};

describe('NavigationService', () => {
  let service: NavigationService;
  let prisma: {
    district: { findMany: jest.Mock; findFirst: jest.Mock; count: jest.Mock };
    building: { findMany: jest.Mock; findFirst: jest.Mock };
    room: { findMany: jest.Mock; findFirst: jest.Mock };
    agent: { findMany: jest.Mock; findFirst: jest.Mock; count: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      district: {
        findMany: jest.fn().mockResolvedValue([reasoningDistrict]),
        findFirst: jest.fn().mockResolvedValue(reasoningDistrict),
        count: jest.fn().mockResolvedValue(5),
      },
      building: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue({
          id: 'building-uuid',
          slug: 'building-planning-tower',
          districtId: 'district-uuid',
          buildingType: 'planning_tower',
          name: 'Planning Tower',
          state: 'active',
          detailLevel: 'full',
          position: { x: 0, y: 0, z: 0 },
          capacity: {},
          metrics: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        }),
      },
      room: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null),
      },
      agent: {
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue(null),
        count: jest.fn().mockResolvedValue(50),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NavigationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NavigationService>(NavigationService);
  });

  it('getNavigation returns megacity breadcrumbs and districts', async () => {
    const result = await service.getNavigation('megacity');

    expect(result.data.scale).toBe('megacity');
    expect(result.data.breadcrumbs).toEqual([
      { scale: 'megacity', label: 'AI Megacity' },
    ]);
    expect(result.data.entities.districts).toHaveLength(1);
    expect(result.data.hierarchy[0].label).toBe('AI Megacity');
    expect(result.meta?.scale).toBe('megacity');
  });

  it('getNavigation builds agent breadcrumb trail from slug focus', async () => {
    prisma.agent.findFirst.mockResolvedValue({
      id: 'agent-uuid',
      slug: 'agent-sigma-7',
      name: 'Analyst Sigma-7',
      role: 'planner',
      homeDistrictId: 'district-uuid',
      homeBuildingId: 'building-uuid',
      homeRoomId: 'room-uuid',
      model: 'claude-sonnet-4',
      version: '1.0.0',
      status: 'idle',
      capabilities: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await service.getNavigation('agent', 'agent-sigma-7');

    expect(result.data.breadcrumbs.map((crumb) => crumb.label)).toEqual([
      'AI Megacity',
      'Reasoning District',
      'Planning Tower',
      'Strategy Room',
      'Analyst Sigma-7',
    ]);
    expect(result.data.entities.agents).toHaveLength(1);
  });
});
