import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { AgentStatusPayload } from '@ultron/shared';
import type { Agent } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { PolicyEvaluatorService } from './policy-evaluator.service';
import {
  clampToBounds,
  getRoomBoundsBySlug,
  randomPointInBounds,
} from './room-nav.util';
import { WorldBroadcastService } from './world-broadcast.service';

const BEHAVIOR_TICK_SECONDS = 10;
const BASE_WANDER_SPEED = 0.8;

@Injectable()
export class AgentBehaviorService implements OnModuleInit {
  private readonly logger = new Logger(AgentBehaviorService.name);
  private roomSlugById = new Map<string, string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly policyEvaluator: PolicyEvaluatorService,
    private readonly broadcast: WorldBroadcastService,
  ) {}

  async onModuleInit(): Promise<void> {
    const rooms = await this.prisma.room.findMany({
      where: { deletedAt: null },
      select: { id: true, slug: true },
    });
    for (const room of rooms) {
      this.roomSlugById.set(room.id, room.slug);
    }
  }

  @Cron('*/10 * * * * *')
  async runBehaviorTick(): Promise<void> {
    const started = Date.now();
    const policy = await this.policyEvaluator.evaluate();
    const speed =
      BASE_WANDER_SPEED * policy.wanderSpeedMultiplier * BEHAVIOR_TICK_SECONDS;

    const agents = await this.prisma.agent.findMany({
      where: { deletedAt: null, status: { not: 'offline' } },
      include: { homeRoom: { select: { slug: true } } },
    });

    const updates: AgentStatusPayload[] = [];
    const writes: Array<ReturnType<PrismaService['agent']['update']>> = [];

    for (const agent of agents) {
      if (agent.status === 'thinking') {
        continue;
      }

      const roomSlug =
        agent.homeRoom?.slug ??
        (agent.homeRoomId
          ? this.roomSlugById.get(agent.homeRoomId)
          : undefined) ??
        null;
      const bounds = policy.roomBoundsEnforced
        ? getRoomBoundsBySlug(roomSlug ?? null)
        : getRoomBoundsBySlug('room-strategy');

      const stepped = this.stepAgent(agent, bounds, speed);
      writes.push(
        this.prisma.agent.update({
          where: { id: agent.id },
          data: stepped.data,
        }),
      );
      updates.push({
        agentId: agent.id,
        status: stepped.status,
        position: [stepped.positionX, stepped.positionY, stepped.positionZ],
        rotationY: stepped.rotationY,
        roomId: agent.homeRoomId ?? undefined,
        buildingId: agent.homeBuildingId,
      });
    }

    await Promise.all(writes);

    if (updates.length > 0) {
      this.broadcast.queueAgentUpdates(updates);
      this.broadcast.flushWorldState('agent');
    }

    this.logger.debug(
      `Behavior tick: ${updates.length} agents in ${Date.now() - started}ms`,
    );
  }

  private stepAgent(
    agent: Agent,
    bounds: ReturnType<typeof getRoomBoundsBySlug>,
    speed: number,
  ): {
    data: {
      positionX: number;
      positionY: number;
      positionZ: number;
      rotationY: number;
      wanderTargetX: number;
      wanderTargetZ: number;
      status: Agent['status'];
    };
    positionX: number;
    positionY: number;
    positionZ: number;
    rotationY: number;
    status: Agent['status'];
  } {
    let targetX = agent.wanderTargetX;
    let targetZ = agent.wanderTargetZ;

    if (targetX === null || targetZ === null) {
      const point = randomPointInBounds(bounds);
      targetX = point.x;
      targetZ = point.z;
    }

    let dx = targetX - agent.positionX;
    let dz = targetZ - agent.positionZ;
    let dist = Math.hypot(dx, dz);

    if (dist < 0.4) {
      const point = randomPointInBounds(bounds);
      targetX = point.x;
      targetZ = point.z;
      dx = targetX - agent.positionX;
      dz = targetZ - agent.positionZ;
      dist = Math.hypot(dx, dz);
    }

    const step = dist > 0 ? Math.min(speed, dist) : 0;
    const nextX = agent.positionX + (dx / (dist || 1)) * step;
    const nextZ = agent.positionZ + (dz / (dist || 1)) * step;
    const clamped = clampToBounds(nextX, nextZ, bounds);
    const rotationY = dist > 0.01 ? Math.atan2(dx, dz) : agent.rotationY;
    const isMoving = step > 0.05;
    const status: Agent['status'] =
      agent.status === 'learning' ? 'learning' : isMoving ? 'acting' : 'idle';

    return {
      data: {
        positionX: clamped.x,
        positionY: agent.positionY,
        positionZ: clamped.z,
        rotationY,
        wanderTargetX: targetX,
        wanderTargetZ: targetZ,
        status,
      },
      positionX: clamped.x,
      positionY: agent.positionY,
      positionZ: clamped.z,
      rotationY,
      status,
    };
  }
}
