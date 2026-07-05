'use client';

import { Loader2, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAgentDialogue } from '@/hooks/useAgentDialogue';
import { getEntityDetail } from '@/lib/shell-data';
import { useAgentStore } from '@/stores/agentStore';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

const DIALOGUE_WARNING_KEY = 'ultron-dialogue-warning-seen';

export function DialoguePanel(): React.JSX.Element | null {
  const isOpen = useUiStore((state) => state.isPanelOpen('dialogue'));
  const dialogueAgentId = useUiStore((state) => state.dialogueAgentId);
  const closeDialogue = useUiStore((state) => state.closeDialogue);
  const entity = getEntityDetail(dialogueAgentId);
  const messages = useAgentStore((state) => state.messages);
  const clearDialogue = useAgentStore((state) => state.clearDialogue);
  const { sendMessage, isStreaming, connectionStatus, error } =
    useAgentDialogue();

  const [showWarning, setShowWarning] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.localStorage.getItem(DIALOGUE_WARNING_KEY) !== 'true',
  );
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isStreaming]);

  const handleDismissWarning = (): void => {
    window.localStorage.setItem(DIALOGUE_WARNING_KEY, 'true');
    setShowWarning(false);
  };

  const handleClose = (): void => {
    closeDialogue();
    clearDialogue();
    setDraft('');
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isStreaming) {
      return;
    }
    setDraft('');
    await sendMessage(text);
  };

  if (!isOpen || !dialogueAgentId) {
    return null;
  }

  const displayName = entity?.name ?? dialogueAgentId;
  const displaySubtitle = entity?.subtitle ?? 'Agent dialogue';

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center p-4 md:items-center">
      <GlassPanel
        as="section"
        aria-label="Agent dialogue"
        className={cn(
          'pointer-events-auto flex w-full max-w-md flex-col',
          'max-md:max-h-[70vh] md:max-h-[480px]',
        )}
      >
        <div className="border-steel-blue/40 flex items-center justify-between border-b px-4 py-3">
          <div>
            <p className="font-display text-text-primary text-sm">
              {displayName}
            </p>
            <p className="text-text-secondary text-xs">{displaySubtitle}</p>
          </div>
          <button
            type="button"
            aria-label="Close dialogue"
            onClick={handleClose}
            className="text-text-secondary hover:bg-steel-blue/50 hover:text-text-primary rounded p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {showWarning ? (
          <div className="border-signal-amber/30 bg-signal-amber/10 border-b px-4 py-3">
            <p className="text-signal-amber text-xs leading-relaxed">
              All conversations are public. Anyone can read this dialogue. Do
              not share secrets or personal information.
            </p>
            <button
              type="button"
              onClick={handleDismissWarning}
              className="text-signal-cyan mt-2 text-xs font-medium hover:underline"
            >
              I understand
            </button>
          </div>
        ) : null}

        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 ? (
            <div className="bg-steel-blue/30 text-text-secondary rounded-md px-3 py-2 text-xs">
              Ask {displayName} about threats, planning, or district operations.
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'max-w-[85%] rounded-md px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'bg-signal-cyan/20 text-text-primary ml-auto'
                  : 'bg-steel-blue/40 text-text-primary',
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.streaming ? (
                <span className="bg-signal-cyan mt-1 inline-block h-3 w-1 animate-pulse" />
              ) : null}
            </div>
          ))}

          {error ? (
            <p className="text-signal-amber text-xs" role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <form
          className="border-steel-blue/40 flex gap-2 border-t p-3"
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
        >
          <input
            type="text"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
            }}
            placeholder="Type a message..."
            disabled={isStreaming}
            maxLength={10_000}
            className="border-steel-blue/60 bg-void-black/60 text-text-primary placeholder:text-text-tertiary flex-1 rounded-md border px-3 py-2 text-sm disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isStreaming || draft.trim().length === 0}
            aria-label="Send message"
            className="border-signal-cyan/60 bg-signal-cyan/20 text-signal-cyan rounded-md border px-3 py-2 disabled:opacity-40"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        {connectionStatus === 'connecting' ? (
          <p className="text-text-tertiary px-4 pb-2 text-[10px]">
            Connecting to dialogue stream…
          </p>
        ) : null}
      </GlassPanel>
    </div>
  );
}
