import { Module } from '@nestjs/common';

import { MetricsModule } from './common/metrics/metrics.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AgentsModule } from './modules/agents/agents.module';
import { BuildingsModule } from './modules/buildings/buildings.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { HealthModule } from './modules/health/health.module';
import { MemoryModule } from './modules/memory/memory.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { SimulationModule } from './modules/simulation/simulation.module';
import { StarSystemsModule } from './modules/star-systems/star-systems.module';
import { WorldModule } from './modules/world/world.module';

@Module({
  imports: [
    PrismaModule,
    MetricsModule,
    HealthModule,
    NavigationModule,
    DistrictsModule,
    BuildingsModule,
    AgentsModule,
    MemoryModule,
    WorldModule,
    StarSystemsModule,
    RealtimeModule,
    SimulationModule,
  ],
})
export class AppModule {}
