import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

/** Max message length per docs/architecture/realtime.md */
export const DIALOGUE_MESSAGE_MAX_LENGTH = 10_000;

/** Anonymous WS messages per minute per docs/architecture/api-contracts.md */
export const DIALOGUE_WS_RATE_LIMIT_PER_MIN = 120;

export class AgentDialogueBodyDto {
  @IsString()
  @MaxLength(DIALOGUE_MESSAGE_MAX_LENGTH)
  message!: string;

  @IsOptional()
  @IsUUID()
  sessionId?: string;
}
