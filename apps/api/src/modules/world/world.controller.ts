import { Controller, Get, Param } from '@nestjs/common';
import type {
  ApiResponse,
  EarthState,
  WorldStateVariables,
} from '@ultron/shared';

import { UuidParamDto } from '../../common/dto/params.dto';
import { WorldService } from './world.service';

@Controller('world')
export class WorldController {
  constructor(private readonly worldService: WorldService) {}

  @Get('state')
  getWorldState(): ApiResponse<WorldStateVariables> {
    return this.worldService.getWorldState();
  }
}

@Controller('earth')
export class EarthController {
  constructor(private readonly worldService: WorldService) {}

  @Get('state')
  getEarthState(): ApiResponse<EarthState> {
    return this.worldService.getEarthState();
  }

  @Get('ground-stations')
  getGroundStations(): ApiResponse<EarthState['groundStations']> {
    return this.worldService.getGroundStations();
  }
}

@Controller('ring')
export class RingController {
  constructor(private readonly worldService: WorldService) {}

  @Get('segments')
  getRingSegments(): ApiResponse<unknown[]> {
    return this.worldService.getRingSegments();
  }

  @Get('segments/:id')
  getRingSegment(@Param() params: UuidParamDto): ApiResponse<unknown> {
    return this.worldService.getRingSegment(params.id);
  }
}
