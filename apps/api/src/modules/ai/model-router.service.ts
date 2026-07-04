import { Injectable, Logger } from '@nestjs/common';

export interface StreamCompletionInput {
  agentId: string;
  agentName: string;
  agentRole: string;
  message: string;
}

export interface StreamToken {
  token: string;
  done?: boolean;
}

const STUB_CHUNK_DELAY_MS = 40;

@Injectable()
export class ModelRouterService {
  private readonly logger = new Logger(ModelRouterService.name);

  private get ollamaBaseUrl(): string | undefined {
    return process.env.OLLAMA_BASE_URL?.replace(/\/$/, '');
  }

  private get ollamaModel(): string {
    return process.env.OLLAMA_MODEL ?? 'llama3.2';
  }

  async *streamCompletion(
    input: StreamCompletionInput,
  ): AsyncGenerator<StreamToken> {
    if (this.ollamaBaseUrl) {
      yield* this.streamFromOllama(input);
      return;
    }

    yield* this.streamStubResponse(input);
  }

  private async *streamFromOllama(
    input: StreamCompletionInput,
  ): AsyncGenerator<StreamToken> {
    const prompt = [
      `You are ${input.agentName}, a ${input.agentRole} agent in the Ultron Reasoning District.`,
      `Respond concisely to the visitor.`,
      '',
      `Visitor: ${input.message}`,
      `${input.agentName}:`,
    ].join('\n');

    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.ollamaModel,
          prompt,
          stream: true,
        }),
      });

      if (!response.ok || !response.body) {
        this.logger.warn(
          `Ollama request failed (${response.status}); falling back to stub`,
        );
        yield* this.streamStubResponse(input);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          const parsed = JSON.parse(line) as {
            response?: string;
            done?: boolean;
          };
          if (parsed.response) {
            yield { token: parsed.response };
          }
          if (parsed.done) {
            yield { token: '', done: true };
            return;
          }
        }
      }

      yield { token: '', done: true };
    } catch (error) {
      this.logger.warn(
        `Ollama stream error: ${error instanceof Error ? error.message : 'unknown'}`,
      );
      yield* this.streamStubResponse(input);
    }
  }

  private async *streamStubResponse(
    input: StreamCompletionInput,
  ): AsyncGenerator<StreamToken> {
    const text = `[${input.agentName} · ${input.agentRole}] Acknowledged: "${input.message.trim()}". I am operating in stub mode — connect OLLAMA_BASE_URL for live inference.`;
    const words = text.split(/(\s+)/);

    for (const word of words) {
      if (word.length === 0) {
        continue;
      }
      yield { token: word };
      await this.delay(STUB_CHUNK_DELAY_MS);
    }

    yield { token: '', done: true };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
