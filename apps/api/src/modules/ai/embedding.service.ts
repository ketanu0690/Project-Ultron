import { Injectable, Logger } from '@nestjs/common';
import { EMBEDDING_DIMENSIONS } from '@ultron/shared';
import { createHash } from 'node:crypto';

const OPENROUTER_EMBEDDINGS_URL = 'https://openrouter.ai/api/v1/embeddings';
const EMBEDDING_MODEL = 'openai/text-embedding-3-small';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  private get openRouterApiKey(): string | undefined {
    return process.env.OPENROUTER_API_KEY;
  }

  async embed(text: string): Promise<number[]> {
    const normalized = text.trim();
    if (normalized.length === 0) {
      return this.stubEmbedding('');
    }

    if (this.openRouterApiKey) {
      try {
        return await this.embedViaOpenRouter(normalized);
      } catch (error) {
        const detail = error instanceof Error ? error.message : 'unknown';
        this.logger.warn(
          `OpenRouter embedding failed (${detail}); using stub vector`,
        );
      }
    }

    return this.stubEmbedding(normalized);
  }

  toPgVectorLiteral(vector: number[]): string {
    return `[${vector.map((value) => value.toFixed(8)).join(',')}]`;
  }

  private async embedViaOpenRouter(text: string): Promise<number[]> {
    const apiKey = this.openRouterApiKey;
    if (!apiKey) {
      return this.stubEmbedding(text);
    }

    const response = await fetch(OPENROUTER_EMBEDDINGS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter embeddings HTTP ${String(response.status)}`);
    }

    const payload = (await response.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };
    const embedding = payload.data?.[0]?.embedding;

    if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error('Invalid embedding response from OpenRouter');
    }

    return embedding;
  }

  /** Deterministic dev/test fallback when no embedding provider is configured. */
  private stubEmbedding(text: string): number[] {
    const vector = new Array<number>(EMBEDDING_DIMENSIONS).fill(0);
    const digest = createHash('sha256').update(text).digest();

    for (let index = 0; index < EMBEDDING_DIMENSIONS; index += 1) {
      const byte = digest[index % digest.length] ?? 0;
      vector[index] = (byte / 255) * 2 - 1;
    }

    return vector;
  }
}
