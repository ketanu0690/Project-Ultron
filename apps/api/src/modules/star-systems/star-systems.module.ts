import { Module } from '@nestjs/common';

import { StarSystemsController } from './star-systems.controller';
import { StarSystemsService } from './star-systems.service';

@Module({
  controllers: [StarSystemsController],
  providers: [StarSystemsService],
  exports: [StarSystemsService],
})
export class StarSystemsModule {}
