import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

import {
  AGENT_STATUSES,
  DISTRICT_IDS,
  type AgentStatus,
  type DistrictId,
} from '@ultron/shared';

export class AgentsQueryDto {
  @IsOptional()
  @IsIn([...DISTRICT_IDS])
  district?: DistrictId;

  @IsOptional()
  @IsIn([...AGENT_STATUSES])
  status?: AgentStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 50;
}
