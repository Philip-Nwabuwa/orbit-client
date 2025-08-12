import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DraftContent {
  text: string;
  updatedAt: number;
}

interface DraftState {
  drafts: Record<string, DraftContent>;
  setDraft: (key: string, text: string) => void;
  clearDraft: (key: string) => void;
  getDraftText: (key: string) => string | undefined;
  hasDraft: (key: string) => boolean;
}

export const makeConversationKey = (
  workspaceId: string,
  channelId?: string,
  dmUserId?: string
) => {
  if (channelId) return `w:${workspaceId}|c:${channelId}`;
  if (dmUserId) return `w:${workspaceId}|dm:${dmUserId}`;
  return `w:${workspaceId}|general`;
};

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: {},
      setDraft: (key, text) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [key]: { text, updatedAt: Date.now() },
          },
        })),
      clearDraft: (key) =>
        set((state) => {
          const { [key]: _, ...rest } = state.drafts;
          return { drafts: rest };
        }),
      getDraftText: (key) => get().drafts[key]?.text,
      hasDraft: (key) => Boolean(get().drafts[key]?.text?.trim()),
    }),
    {
      name: "chat-drafts",
      partialize: (state) => ({ drafts: state.drafts }),
    }
  )
);
