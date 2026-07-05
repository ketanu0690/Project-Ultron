import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { PrismaService } from '../../src/common/prisma/prisma.service';
import { createPrismaMock, type PrismaMock } from './prisma-mock';

export interface TestAppContext {
  app: INestApplication;
  baseUrl: string;
  port: number;
  prisma: PrismaMock;
}

export async function createTestApp(
  prismaOverrides: Partial<PrismaMock> = {},
): Promise<TestAppContext> {
  const prisma = createPrismaMock(prismaOverrides);

  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useWebSocketAdapter(new WsAdapter(app));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(0);
  const address = app.getHttpServer().address();
  const port =
    typeof address === 'object' && address !== null ? address.port : 0;

  return {
    app,
    baseUrl: `http://127.0.0.1:${String(port)}`,
    port,
    prisma,
  };
}

export async function closeTestApp(ctx: TestAppContext): Promise<void> {
  await ctx.app.close();
}
