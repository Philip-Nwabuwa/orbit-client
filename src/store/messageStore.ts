import { create } from "zustand";
import avatarUrl from "@/assets/images/hero.jpeg";

export interface Reaction {
  emoji: string;
  count: number;
}

export interface MessageItemModel {
  id: string;
  avatarUrl: string; // resolved URL string
  name: string;
  time: string;
  message: string;
  mentions?: string[];
  reactions: Reaction[];
  hasAttachment?: boolean;
  attachmentTitle?: string;
  attachmentUrl?: string;
  showQuickView?: boolean;
  imageUrl?: string;
  imageAlt?: string;
}

interface MessageState {
  messages: MessageItemModel[];
  initializeMessages: () => void;
  addMessage: (message: MessageItemModel) => void;
  updateMessage: (id: string, updates: Partial<MessageItemModel>) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],

  initializeMessages: () =>
    set({
      messages: [
        {
          id: "1",
          avatarUrl: avatarUrl.src,
          name: "User",
          time: "2h ago",
          message:
            "Hey team, I wanted to discuss the custom UI-kit we're developing for the site redesign. We need to finalize some components and make key design decisions to ensure consistency across the board. Let's make sure we cover colors, typography, buttons, and any other essential UI elements.",
          mentions: ["@UX/UI", "@Sophia"],
          reactions: [
            { emoji: "✌️", count: 2 },
            { emoji: "💪", count: 0 },
          ],
        },
        {
          id: "2",
          avatarUrl: avatarUrl.src,
          name: "Diana T.",
          time: "2d ago",
          message:
            "I have already prepared all styles and components according to our standards during the design phase, so the UI kit is 90% complete. All that remains is to add some states to the interactive elements and prepare the Lottie files for animations.",
          mentions: ["@Emily"],
          hasAttachment: true,
          attachmentTitle: "Conceptzilla website v.3.0",
          attachmentUrl: "www.figma.com",
          showQuickView: true,
          reactions: [
            { emoji: "❤️", count: 0 },
            { emoji: "💪", count: 0 },
          ],
        },
        {
          id: "3",
          avatarUrl: avatarUrl.src,
          name: "Daniel A.",
          time: "3h ago",
          message:
            "Okay, keep me updated. @Diana T. I also wanted to remind you to keep the layers organized.",
          mentions: ["@Diana"],
          reactions: [],
        },
        // Back-to-back message by the same person
        {
          id: "4",
          avatarUrl: avatarUrl.src,
          name: "Daniel A.",
          time: "2h 58m ago",
          message:
            "Also, let's document any custom tokens we add so devs can reference them easily.",
          reactions: [{ emoji: "✅", count: 1 }],
        },
        // Message with an image preview
        {
          id: "5",
          avatarUrl: avatarUrl.src,
          name: "Emily D.",
          time: "1h ago",
          message: "Here's the latest header hero exploration.",
          reactions: [{ emoji: "🔥", count: 3 }],
          imageUrl: avatarUrl.src,
          imageAlt: "Header hero exploration preview",
        },
        // Another user adds a quick follow-up
        {
          id: "6",
          avatarUrl: avatarUrl.src,
          name: "User",
          time: "just now",
          message:
            "Looks great! Let's share this with @Management for sign-off.",
          mentions: ["@Management"],
          reactions: [],
        },
      ],
    }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),
}));
