import { getApiBaseUrl } from '@/lib/api-client';
import { useUiStore } from '@/stores/uiStore';

/**
 * Nexus integration point — call from RightSidebar Talk button.
 * Phoenix owns dialogue open/close; Nexus passes the agent entity id.
 */
export function openDialogue(agentId: string): void {
  useUiStore.getState().openDialogue(agentId);
}

export function closeDialogue(): void {
  useUiStore.getState().closeDialogue();
}

export function getWsBaseUrl(): string {
  const apiUrl = getApiBaseUrl();
  const url = new URL(apiUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = '/ws';
  url.search = '';
  url.hash = '';
  return url.toString();
}
