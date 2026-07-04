import { ModelRouterService } from '../../src/modules/ai/model-router.service';

describe('phoenix ModelRouterService', () => {
  const service = new ModelRouterService();

  beforeEach(() => {
    delete process.env.OLLAMA_BASE_URL;
  });

  it('streams stub tokens when Ollama is not configured', async () => {
    const tokens: string[] = [];

    for await (const chunk of service.streamCompletion({
      agentId: 'agent-1',
      agentName: 'Sigma-7',
      agentRole: 'planner',
      message: 'Status report?',
    })) {
      if (chunk.token) {
        tokens.push(chunk.token);
      }
    }

    const text = tokens.join('');
    expect(text).toContain('Sigma-7');
    expect(text).toContain('Status report?');
    expect(text).toContain('stub mode');
  });
});
