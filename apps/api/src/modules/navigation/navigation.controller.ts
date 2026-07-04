import { Controller, Get, Param, Query } from '@nestjs/common';
import type { ApiResponse } from '@ultron/shared';

import {
  NavigationParamsDto,
  NavigationQueryDto,
} from './dto/navigation-query.dto';
import { SearchQueryDto } from './dto/search-query.dto';
import { NavigationBundle, NavigationService } from './navigation.service';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get(':scale')
  getNavigation(
    @Param() params: NavigationParamsDto,
    @Query() query: NavigationQueryDto,
  ): Promise<ApiResponse<NavigationBundle>> {
    return this.navigationService.getNavigation(params.scale, query.focus);
  }
}

@Controller('search')
export class SearchController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  search(
    @Query() query: SearchQueryDto,
  ): Promise<ApiResponse<Array<{ id: string; type: string; name: string }>>> {
    return this.navigationService.search(query.q, query.type, query.limit);
  }
}
