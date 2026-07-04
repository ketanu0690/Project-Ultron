import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

import { SCALE_LEVELS, type ScaleLevel } from '@ultron/shared';

export class NavigationParamsDto {
  @IsIn([...SCALE_LEVELS])
  scale!: ScaleLevel;
}

export class NavigationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(128)
  focus?: string;
}
