import { IsString, Matches, MaxLength } from 'class-validator';

export class StarSystemIdParamDto {
  @IsString()
  @MaxLength(64)
  @Matches(/^star-[a-z0-9-]+$/)
  id!: string;
}
