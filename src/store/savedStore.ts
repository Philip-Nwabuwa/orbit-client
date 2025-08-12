import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedItem {
  messageId: string;
  workspaceId: string;
  channelId?: string;
  dmUserId?: string;
  preview: string;
  authorName?: string;
  savedAt: number;
}

interface SavedState {
  savedByMessageId: Record<string, SavedItem>;
  toggleSaveMessage: (item: Omit<SavedItem, "savedAt">) => void;
  removeSaved: (messageId: string) => void;
  isSaved: (messageId: string) => boolean;
  getSavedForWorkspace: (workspaceId: string) => SavedItem[];
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedByMessageId: {},

      toggleSaveMessage: (item) =>
        set((state) => {
          const exists = Boolean(state.savedByMessageId[item.messageId]);
          if (exists) {
            const { [item.messageId]: _removed, ...rest } =
              state.savedByMessageId;
            return { savedByMessageId: rest };
          }
          return {
            savedByMessageId: {
              ...state.savedByMessageId,
              [item.messageId]: {
                ...item,
                savedAt: Date.now(),
              },
            },
          };
        }),

      removeSaved: (messageId) =>
        set((state) => {
          const { [messageId]: _removed, ...rest } = state.savedByMessageId;
          return { savedByMessageId: rest };
        }),

      isSaved: (messageId) => Boolean(get().savedByMessageId[messageId]),

      getSavedForWorkspace: (workspaceId) =>
        Object.values(get().savedByMessageId)
          .filter((i) => i.workspaceId === workspaceId)
          .sort((a, b) => b.savedAt - a.savedAt),
    }),
    {
      name: "saved-items",
      partialize: (state) => ({ savedByMessageId: state.savedByMessageId }),
    }
  )
);
