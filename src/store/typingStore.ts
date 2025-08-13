import { create } from "zustand";

interface TypingState {
  typingKeys: Record<string, boolean>;
  pingTyping: (key: string, ttlMs?: number) => void;
  isTyping: (key: string) => boolean;
}

export const useTypingStore = create<TypingState>(() => ({
  typingKeys: {},
  pingTyping: (() => {
    const timers = new Map<string, any>();
    return (key: string, ttlMs: number = 2000) => {
      const set = (useTypingStore as any).setState as (partial: any) => void;
      // Mark as typing
      set((state: TypingState) => ({
        typingKeys: { ...state.typingKeys, [key]: true },
      }));
      // Reset previous timer
      const existing = timers.get(key);
      if (existing) clearTimeout(existing);
      const t = setTimeout(() => {
        set((state: TypingState) => {
          const { [key]: _removed, ...rest } = state.typingKeys;
          return { typingKeys: rest };
        });
        timers.delete(key);
      }, ttlMs);
      timers.set(key, t);
    };
  })(),
  isTyping: (key: string) => {
    const state = (useTypingStore as any).getState() as TypingState;
    return Boolean(state.typingKeys[key]);
  },
}));
