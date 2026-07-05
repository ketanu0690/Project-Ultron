/**
 * Nexus QA — API contract matrix against in-process Nest app.
 * @see docs/qa/nexus-scenarios.md
 */

import {
  closeTestApp,
  createTestApp,
  type TestAppContext,
} from '../support/create-test-app';
import {
  MOCK_AGENT_SIGMA_7,
  MOCK_DISTRICT_REASONING,
} from '../support/prisma-mock';

describe('API contract (Nexus QA)', () => {
  let ctx: TestAppContext;

  beforeAll(async () => {
    ctx = await createTestApp();
  });

  afterAll(async () => {
    await closeTestApp(ctx);
  });

  it('GET /api/v1/health returns ApiResponse envelope', async () => {
    const response = await fetch(`${ctx.baseUrl}/api/v1/health`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      data: { status: string };
      timestamp: string;
    };
    expect(body.data.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
  });

  it('GET /api/v1/ready returns ready when database check passes', async () => {
    const response = await fetch(`${ctx.baseUrl}/api/v1/ready`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      data: {
        status: string;
        checks: { database: string };
      };
      timestamp: string;
    };
    expect(body.data.status).toBe('ready');
    expect(body.data.checks.database).toBe('ok');
    expect(body.timestamp).toBeDefined();
  });

  it('GET /api/v1/districts returns seeded district list envelope', async () => {
    const response = await fetch(`${ctx.baseUrl}/api/v1/districts`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      data: Array<{ slug: string; name: string }>;
      timestamp: string;
    };
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data[0]?.slug).toBe('reasoning');
    expect(body.data[0]?.name).toBe(MOCK_DISTRICT_REASONING.name);
    expect(body.timestamp).toBeDefined();
  });

  it('GET /api/v1/districts/reasoning returns district detail envelope', async () => {
    const response = await fetch(`${ctx.baseUrl}/api/v1/districts/reasoning`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      data: { slug: string; agentCount: number };
      timestamp: string;
    };
    expect(body.data.slug).toBe('reasoning');
    expect(body.data.agentCount).toBe(50);
    expect(body.timestamp).toBeDefined();
  });

  it('GET /api/v1/agents/:slug/memory returns memory timeline envelope', async () => {
    const response = await fetch(
      `${ctx.baseUrl}/api/v1/agents/${MOCK_AGENT_SIGMA_7.slug}/memory`,
    );
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      data: Array<{ content: string; type: string }>;
      timestamp: string;
    };
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]?.content).toBeDefined();
    expect(body.timestamp).toBeDefined();
  });

  it('rejects invalid district id with ValidationPipe ApiError envelope', async () => {
    const response = await fetch(
      `${ctx.baseUrl}/api/v1/districts/not-a-valid-district`,
    );
    expect(response.status).toBe(400);

    const body = (await response.json()) as {
      statusCode: number;
      message: string;
      timestamp: string;
    };
    expect(body.statusCode).toBe(400);
    expect(body.message).toBeDefined();
    expect(body.timestamp).toBeDefined();
  });

  it('returns 404 ApiError for unknown district', async () => {
    ctx.prisma.district.findFirst.mockResolvedValueOnce(null);

    const response = await fetch(`${ctx.baseUrl}/api/v1/districts/perception`);
    expect(response.status).toBe(404);

    const body = (await response.json()) as {
      statusCode: number;
      message: string;
      timestamp: string;
    };
    expect(body.statusCode).toBe(404);
    expect(body.message).toContain('not found');
    expect(body.timestamp).toBeDefined();
  });

  it('returns 404 ApiError for unknown agent memory', async () => {
    const response = await fetch(
      `${ctx.baseUrl}/api/v1/agents/missing-agent/memory`,
    );
    expect(response.status).toBe(404);

    const body = (await response.json()) as {
      statusCode: number;
      message: string;
      timestamp: string;
    };
    expect(body.statusCode).toBe(404);
    expect(body.message).toContain('not found');
    expect(body.timestamp).toBeDefined();
  });
});
