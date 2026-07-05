import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';

export interface GeneratedEvent {
  readonly id: string;
  readonly type: string;
  readonly severity: string;
  readonly data: Record<string, unknown>;
}

const EVENT_TYPES: ReadonlyArray<{
  type: string;
  severity: string;
  weight: number;
}> = [
  { type: 'agent_milestone', severity: 'low', weight: 4 },
  { type: 'discovery', severity: 'low', weight: 3 },
  { type: 'building_degraded', severity: 'medium', weight: 2 },
  { type: 'threat_detected', severity: 'high', weight: 1 },
];

@Injectable()
export class EventGeneratorService {
  constructor(private readonly prisma: PrismaService) {}

  maybeGenerate(tickId: number): GeneratedEvent | null {
    const roll = Math.random();
    if (roll > 0.35) {
      return null;
    }

    const totalWeight = EVENT_TYPES.reduce((sum, item) => sum + item.weight, 0);
    let threshold = Math.random() * totalWeight;
    let chosen = EVENT_TYPES[0];
    for (const item of EVENT_TYPES) {
      threshold -= item.weight;
      if (threshold <= 0) {
        chosen = item;
        break;
      }
    }

    if (!chosen) {
      return null;
    }

    return {
      id: randomUUID(),
      type: chosen.type,
      severity: chosen.severity,
      data: {
        tickId,
        message: `Simulation event: ${chosen.type}`,
      },
    };
  }

  async persist(event: GeneratedEvent, tickId: number): Promise<void> {
    await this.prisma.simulationEvent.create({
      data: {
        id: event.id,
        type: event.type,
        severity: event.severity,
        data: event.data as Prisma.InputJsonValue,
        tickId,
      },
    });
  }

  async recent(limit: number): Promise<GeneratedEvent[]> {
    const records = await this.prisma.simulationEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return records.map((record) => ({
      id: record.id,
      type: record.type,
      severity: record.severity,
      data: record.data as Record<string, unknown>,
    }));
  }
}
