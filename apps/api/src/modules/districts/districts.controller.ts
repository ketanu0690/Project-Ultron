import { Controller, Get, Param } from '@nestjs/common';
import type { ApiResponse, District } from '@ultron/shared';

import { DistrictIdParamDto } from '../../common/dto/params.dto';
import { DistrictsService } from './districts.service';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Get()
  findAll(): Promise<ApiResponse<District[]>> {
    return this.districtsService.findAll();
  }

  @Get(':id')
  findById(
    @Param() params: DistrictIdParamDto,
  ): Promise<ApiResponse<District>> {
    return this.districtsService.findById(params.id);
  }

  @Get(':id/buildings')
  findBuildings(
    @Param() params: DistrictIdParamDto,
  ): Promise<ApiResponse<unknown[]>> {
    return this.districtsService.findBuildings(params.id);
  }

  @Get(':id/agents')
  findAgents(
    @Param() params: DistrictIdParamDto,
  ): Promise<ApiResponse<unknown[]>> {
    return this.districtsService.findAgents(params.id);
  }

  @Get(':id/metrics')
  findMetrics(
    @Param() params: DistrictIdParamDto,
  ): Promise<ApiResponse<Record<string, number>>> {
    return this.districtsService.findMetrics(params.id);
  }
}
