import { IsIn, IsString, IsUUID, MaxLength } from 'class-validator';

import { DISTRICT_IDS, type DistrictId } from '@ultron/shared';

export class DistrictIdParamDto {
  @IsIn([...DISTRICT_IDS])
  id!: DistrictId;
}

export class UuidParamDto {
  @IsUUID()
  id!: string;
}

export class AgentIdParamDto {
  @IsString()
  @MaxLength(128)
  agentId!: string;
}
