import { Module } from '@nestjs/common';

import {
  EarthController,
  RingController,
  WorldController,
} from './world.controller';
import { WorldService } from './world.service';

@Module({
  controllers: [WorldController, EarthController, RingController],
  providers: [WorldService],
})
export class WorldModule {}
