import { IsString, MaxLength } from 'class-validator';

/** Accepts Prisma UUID or seed slug (e.g. agent-sigma-7). */
export class AgentRefParamDto {
  @IsString()
  @MaxLength(128)
  id!: string;
}
