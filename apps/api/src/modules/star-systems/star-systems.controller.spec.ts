import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { StarSystemsController } from './star-systems.controller';
import { StarSystemsService } from './star-systems.service';

describe('StarSystemsController', () => {
  let controller: StarSystemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StarSystemsController],
      providers: [StarSystemsService],
    }).compile();

    controller = module.get(StarSystemsController);
  });

  it('GET /star-systems returns systems bundle with metrics', () => {
    const response = controller.getStarSystems();

    expect(response.data.systems.length).toBe(100);
    expect(response.data.metrics.systemCount).toBe(100);
    expect(response.data.metrics.explorationPercent).toBeGreaterThan(0);
    expect(response.meta?.total).toBe(100);
  });

  it('GET /star-systems/:id returns Sol', () => {
    const response = controller.getStarSystem({ id: 'star-sol' });

    expect(response.data.id).toBe('star-sol');
    expect(response.data.name).toBe('Sol');
    expect(response.data.agentCount).toBe(50);
  });

  it('GET /star-systems/:id throws for unknown id', () => {
    expect(() => controller.getStarSystem({ id: 'star-unknown' })).toThrow(
      NotFoundException,
    );
  });
});
