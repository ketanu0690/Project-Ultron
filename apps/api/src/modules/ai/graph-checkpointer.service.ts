import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { PostgresSaver } from '@langchain/langgraph-checkpoint-postgres';

@Injectable()
export class GraphCheckpointerService implements OnModuleDestroy {
  private readonly logger = new Logger(GraphCheckpointerService.name);
  private saver: PostgresSaver | null = null;
  private setupPromise: Promise<void> | null = null;

  async getSaver(): Promise<PostgresSaver | undefined> {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return undefined;
    }

    if (!this.saver) {
      this.saver = PostgresSaver.fromConnString(databaseUrl);
    }

    if (!this.setupPromise) {
      this.setupPromise = this.saver
        .setup()
        .catch((error: unknown) => {
          const detail = error instanceof Error ? error.message : 'unknown';
          this.logger.warn(
            `LangGraph checkpoint setup skipped (${detail}); migration may already exist`,
          );
        })
        .then(() => undefined);
    }

    await this.setupPromise;
    return this.saver;
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.saver) {
      return;
    }

    await this.saver.end();
    this.saver = null;
    this.setupPromise = null;
  }
}
