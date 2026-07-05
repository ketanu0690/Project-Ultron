import { Injectable, Logger } from '@nestjs/common';
import { buildAgentCompletionPrompt } from '@ultron/personality';

export interface RetrievedMemoryContext {
  content: string;
  type?: string;
}

export interface StreamCompletionInput {
  agentId: string;
  agentName: string;
  agentRole: string;
  message: string;
  memories?: RetrievedMemoryContext[];
}

export interface StreamToken {
  token: string;
  done?: boolean;
}

const STUB_CHUNK_DELAY_MS = 40;

interface BytesStreamReader {
  read(): Promise<{ done: boolean; value?: Uint8Array }>;
}

@Injectable()
export class ModelRouterService {
  private readonly logger = new Logger(ModelRouterService.name);

  private get ollamaBaseUrl(): string | undefined {
    return process.env.OLLAMA_BASE_URL?.replace(/\/$/, '');
  }

  private get ollamaModel(): string {
    return process.env.OLLAMA_MODEL ?? 'llama3.2';
  }

  private buildPrompt(input: StreamCompletionInput): string {
    if (!input.memories?.length) {
      return buildAgentCompletionPrompt(input);
    }

    const memoryLines = input.memories
      .map((memory) => `- [${memory.type ?? 'memory'}] ${memory.content}`)
      .join('\n');

    return [
      buildAgentCompletionPrompt(input).replace(
        `Visitor: ${input.message}`,
        `Relevant memories:\n${memoryLines}\n\nVisitor: ${input.message}`,
      ),
    ].join('\n');
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
    const prompt = this.buildPrompt(input);

    const baseUrl = this.ollamaBaseUrl;
    if (!baseUrl) {
      yield* this.streamStubResponse(input);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
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
          `Ollama request failed (${String(response.status)}); falling back to stub`,
        );
        yield* this.streamStubResponse(input);
        return;
      }

      const reader = response.body.getReader() as BytesStreamReader;
      const decoder = new TextDecoder();
      let buffer = '';

      for (;;) {
        const chunk = await reader.read();
        if (chunk.done) {
          break;
        }

        if (chunk.value !== undefined) {
          buffer += decoder.decode(chunk.value, { stream: true });
        }
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
      const detail = error instanceof Error ? error.message : 'unknown';
      this.logger.warn(`Ollama stream error: ${detail}`);
      yield* this.streamStubResponse(input);
    }
  }

  private async *streamStubResponse(
    input: StreamCompletionInput,
  ): AsyncGenerator<StreamToken> {
    const memoryNote =
      input.memories && input.memories.length > 0
        ? ` (recalled ${String(input.memories.length)} memories)`
        : '';
    const text = `[${input.agentName} · ${input.agentRole}] Acknowledged: "${input.message.trim()}"${memoryNote}. I am operating in stub mode — connect OLLAMA_BASE_URL for live inference.`;
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
