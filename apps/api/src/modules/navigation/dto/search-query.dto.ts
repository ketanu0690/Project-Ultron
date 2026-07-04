import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { ENTITY_TYPES, type EntityType } from '@ultron/shared';

export class SearchQueryDto {
  @IsString()
  q!: string;

  @IsOptional()
  @IsIn([...ENTITY_TYPES])
  type?: EntityType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
