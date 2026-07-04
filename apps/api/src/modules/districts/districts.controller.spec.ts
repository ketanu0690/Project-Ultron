import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';

describe('DistrictsController', () => {
  let controller: DistrictsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DistrictsController],
      providers: [
        {
          provide: DistrictsService,
          useValue: {
            findById: jest.fn((id: string) => {
              if (id !== 'reasoning') {
                return Promise.reject(
                  new NotFoundException(`District '${id}' not found`),
                );
              }
              return Promise.resolve({
                data: {
                  id: '00000000-0000-4000-8000-000000000003',
                  slug: 'reasoning',
                  name: 'Reasoning District',
                  themeConfig: {
                    primary: '#6366f1',
                    secondary: '#818cf8',
                    accent: '#a5b4fc',
                  },
                  agentCount: 50,
                  metrics: { throughput: 0, health: 100, buildingCount: 10 },
                  createdAt: '2026-06-14T12:00:00.000Z',
                  updatedAt: '2026-06-14T12:00:00.000Z',
                },
                timestamp: '2026-06-14T12:00:00.000Z',
              });
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<DistrictsController>(DistrictsController);
  });

  it('should return reasoning district wrapped in ApiResponse', async () => {
    const result = await controller.findById({ id: 'reasoning' });

    expect(result.data.slug).toBe('reasoning');
    expect(result.data.name).toBe('Reasoning District');
    expect(result.data.agentCount).toBe(50);
    expect(result.timestamp).toBeDefined();
  });

  it('should throw NotFoundException for invalid district id', async () => {
    await expect(
      controller.findById({ id: 'invalid' as 'reasoning' }),
    ).rejects.toThrow(NotFoundException);
  });
});
