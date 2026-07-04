import { Controller, Get, Param } from '@nestjs/common';
import type {
  ApiResponse,
  StarSystem,
  StarSystemsBundle,
} from '@ultron/shared';

import { StarSystemIdParamDto } from './dto/star-system-id.dto';
import { StarSystemsService } from './star-systems.service';

@Controller('star-systems')
export class StarSystemsController {
  constructor(private readonly starSystemsService: StarSystemsService) {}

  @Get()
  getStarSystems(): ApiResponse<StarSystemsBundle> {
    return this.starSystemsService.getStarSystems();
  }

  @Get(':id')
  getStarSystem(
    @Param() params: StarSystemIdParamDto,
  ): ApiResponse<StarSystem> {
    return this.starSystemsService.getStarSystemById(params.id);
  }
}
