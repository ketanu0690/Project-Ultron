import { test, expect } from '@playwright/test';

import {
  isApiHealthy,
  runTalkAndViewMemory,
  selectAgentFromTree,
  zoomGalaxyToEarth,
} from './helpers/stack';

test.describe('Galaxy-first MVP journey', () => {
  test.beforeEach(async ({ request }) => {
    const healthy = await isApiHealthy(request);
    test.skip(
      !healthy,
      'API not reachable — start NestJS on :4000 (see apps/web/e2e/README.md)',
    );
  });

  test('@ci megacity deep-link → Talk → View Memory', async ({ page }) => {
    await page.goto('/?scale=megacity');

    await expect(page.getByText('Total Agents')).toBeVisible();
    await selectAgentFromTree(page);
    await runTalkAndViewMemory(page);
  });

  test('galaxy zoom-gated scroll reaches Earth', async ({ page }) => {
    test.slow();

    await page.goto('/');

    await expect(page.getByText('Galactic Overview')).toBeVisible();

    await zoomGalaxyToEarth(page);

    await expect(
      page.getByRole('button', { name: 'Enter Brain City' }),
    ).toBeVisible({
      timeout: 20000,
    });
  });
});
