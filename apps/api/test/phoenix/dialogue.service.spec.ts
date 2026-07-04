import { NotFoundException } from '@nestjs/common';

import { AgentOrchestratorService } from '../../src/modules/ai/agent-orchestrator.service';
import { ModelRouterService } from '../../src/modules/ai/model-router.service';
import { DialogueService } from '../../src/modules/realtime/dialogue.service';

describe('phoenix DialogueService', () => {
  const prisma = {
    agent: {
      findFirst: jest.fn(),
    },
  };

  const orchestrator = new AgentOrchestratorService(new ModelRouterService());
  const service = new DialogueService(prisma as never, orchestrator);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects unknown agents', async () => {
    prisma.agent.findFirst.mockResolvedValue(null);

    await expect(
      service.assertAgentExists('missing-agent'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('streams dialogue chunks with session id', async () => {
    prisma.agent.findFirst.mockResolvedValue({
      id: 'agent-1',
      name: 'Sigma-7',
      role: 'planner',
    });

    const chunks: Array<{ token?: string; done?: boolean; sessionId: string }> =
      [];

    await service.streamDialogue(
      { agentId: 'agent-1', message: 'Hello agent' },
      (payload) => {
        chunks.push({
          sessionId: payload.sessionId,
          token: payload.token,
          done: payload.done,
        });
      },
    );

    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some((chunk) => chunk.done)).toBe(true);
    expect(chunks.every((chunk) => chunk.sessionId.length > 0)).toBe(true);
  });
});
