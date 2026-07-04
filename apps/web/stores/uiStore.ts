/**
 * Panel visibility and UI preferences. Subscribe with narrow selectors:
 * useUiStore(s => s.theme)
 *
 * Nexus owns: leftSidebarOpen, rightSidebarOpen (via panels map).
 * Phoenix owns: dialogueOpen, dialogueAgentId — Nexus sets these from Talk action only.
 */
import { create } from 'zustand';

type Theme = 'dark';

export type ShellPanelId =
  'leftSidebar' | 'rightSidebar' | 'dialogue' | 'shortcuts';

const DEFAULT_PANELS: Record<ShellPanelId, boolean> = {
  leftSidebar: false,
  rightSidebar: false,
  dialogue: false,
  shortcuts: false,
};

interface UiState {
  panels: Record<string, boolean>;
  theme: Theme;
  dialogueOpen: boolean;
  dialogueAgentId: string | null;
}

interface UiActions {
  setPanelOpen: (panelId: string, open: boolean) => void;
  togglePanel: (panelId: string) => void;
  isPanelOpen: (panelId: string) => boolean;
  openDialogue: (agentId: string) => void;
  closeDialogue: () => void;
}

export type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>((set, get) => ({
  panels: { ...DEFAULT_PANELS },
  theme: 'dark',
  dialogueOpen: false,
  dialogueAgentId: null,
  setPanelOpen: (panelId, open) => {
    set((state) => ({
      panels: { ...state.panels, [panelId]: open },
    }));
  },
  togglePanel: (panelId) => {
    const current = get().panels[panelId] ?? false;
    get().setPanelOpen(panelId, !current);
  },
  isPanelOpen: (panelId) => {
    return get().panels[panelId] ?? false;
  },
  openDialogue: (agentId) => {
    set({
      dialogueOpen: true,
      dialogueAgentId: agentId,
      panels: { ...get().panels, dialogue: true },
    });
  },
  closeDialogue: () => {
    set({
      dialogueOpen: false,
      dialogueAgentId: null,
      panels: { ...get().panels, dialogue: false },
    });
  },
}));
