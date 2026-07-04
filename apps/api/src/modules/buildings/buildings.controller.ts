import { Controller, Get, Param } from '@nestjs/common';
import type { ApiResponse, Building } from '@ultron/shared';

import { UuidParamDto } from '../../common/dto/params.dto';
import { BuildingsService } from './buildings.service';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get(':id')
  findById(@Param() params: UuidParamDto): Promise<ApiResponse<Building>> {
    return this.buildingsService.findById(params.id);
  }

  @Get(':id/floors')
  findFloors(@Param() params: UuidParamDto): Promise<ApiResponse<unknown[]>> {
    return this.buildingsService.findFloors(params.id);
  }

  @Get(':id/rooms')
  findRooms(@Param() params: UuidParamDto): Promise<ApiResponse<unknown[]>> {
    return this.buildingsService.findRooms(params.id);
  }

  @Get(':id/agents')
  findAgents(@Param() params: UuidParamDto): Promise<ApiResponse<unknown[]>> {
    return this.buildingsService.findAgents(params.id);
  }

  @Get(':id/metrics')
  findMetrics(
    @Param() params: UuidParamDto,
  ): Promise<ApiResponse<Record<string, number>>> {
    return this.buildingsService.findMetrics(params.id);
  }
}
