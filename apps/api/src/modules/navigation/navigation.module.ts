import { Module } from '@nestjs/common';

import {
  NavigationController,
  SearchController,
} from './navigation.controller';
import { NavigationService } from './navigation.service';

@Module({
  controllers: [NavigationController, SearchController],
  providers: [NavigationService],
})
export class NavigationModule {}
