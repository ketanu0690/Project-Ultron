import type { APIRequestContext, Page } from '@playwright/test';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function isApiHealthy(
  request: APIRequestContext,
): Promise<boolean> {
  try {
    const response = await request.get(`${API_BASE_URL}/api/v1/health`);
    return response.ok();
  } catch {
    return false;
  }
}

/** Wheel on canvas to dolly the camera (zoom in/out within current scale). */
export async function dollyCamera(
  page: Page,
  deltaY: number,
  ticks = 1,
): Promise<void> {
  const canvas = page.locator('canvas');

  for (let i = 0; i < ticks; i += 1) {
    await canvas.dispatchEvent('wheel', { deltaY, bubbles: true });
    await page.waitForTimeout(40);
  }
}

/** Zoom galaxy camera in to min dolly distance; core watcher auto-triggers Earth transition. */
export async function zoomGalaxyToEarth(page: Page): Promise<void> {
  await dollyCamera(page, 80, 55);
  await page
    .getByRole('button', { name: 'Enter Brain City' })
    .waitFor({ timeout: 20000 });
}

export async function scrollJourneyForward(
  page: Page,
  steps: number,
): Promise<void> {
  for (let step = 0; step < steps; step += 1) {
    await dollyCamera(page, 80, 40);
    const host = page.getByTestId('world-canvas-host');
    for (let j = 0; j < 3; j += 1) {
      await host.dispatchEvent('wheel', { deltaY: 150, bubbles: true });
      await page.waitForTimeout(250);
    }
    await page.waitForTimeout(800);
  }
}

export async function openNavigationTree(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Open navigation/i }).click();
  await page
    .getByRole('button', { name: 'Galaxy' })
    .waitFor({ state: 'visible' });
}

export async function selectAgentFromTree(page: Page): Promise<void> {
  await openNavigationTree(page);
  await page.getByRole('button', { name: /Sigma-7/i }).click();
  await page
    .getByRole('button', { name: 'Talk' })
    .waitFor({ state: 'visible' });
}

export async function dismissDialogueWarningIfPresent(
  page: Page,
): Promise<void> {
  const dismiss = page.getByRole('button', { name: /I understand/i });
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click();
  }
}

export async function runTalkAndViewMemory(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Talk' }).click();
  await page
    .getByRole('region', { name: 'Agent dialogue' })
    .waitFor({ state: 'visible' });
  await dismissDialogueWarningIfPresent(page);

  await page.getByRole('button', { name: 'View Memory' }).click();
  await page.getByText('MEMORY TIMELINE').waitFor({ state: 'visible' });
}
