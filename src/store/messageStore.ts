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
  imageUrl?: string; // Legacy single image support
  imageAlt?: string; // Legacy single image support
  images?: { url: string; alt?: string }[]; // New multiple images support
  audioUrl?: string; // Voice message audio URL
  isVoiceMessage?: boolean; // Flag to identify voice messages
  // Context fields for channel/DM scoping
  channelId?: string;
  dmUserId?: string;
  workspaceId: string;
}

interface MessageState {
  messages: MessageItemModel[];
  initializeMessages: () => void;
  addMessage: (message: MessageItemModel) => void;
  updateMessage: (id: string, updates: Partial<MessageItemModel>) => void;
  getMessagesForChannel: (
    channelId: string,
    workspaceId: string
  ) => MessageItemModel[];
  getMessagesForDM: (
    dmUserId: string,
    workspaceId: string
  ) => MessageItemModel[];
  initializeChannelMessages: (channelId: string, workspaceId: string) => void;
  initializeDMMessages: (dmUserId: string, workspaceId: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, emoji: string) => void;
  toggleReaction: (messageId: string, emoji: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],

  // Legacy method - kept for compatibility
  initializeMessages: () => {
    // Initialize with general channel messages
    get().initializeChannelMessages("6", "1");
  },

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  getMessagesForChannel: (channelId: string, workspaceId: string) => {
    return get().messages.filter(
      (msg) => msg.channelId === channelId && msg.workspaceId === workspaceId
    );
  },

  getMessagesForDM: (dmUserId: string, workspaceId: string) => {
    return get().messages.filter(
      (msg) => msg.dmUserId === dmUserId && msg.workspaceId === workspaceId
    );
  },

  initializeChannelMessages: (channelId: string, workspaceId: string) => {
    const existing = get().messages.find(
      (msg) => msg.channelId === channelId && msg.workspaceId === workspaceId
    );
    if (existing) return; // Already initialized

    const channelMessages = getChannelSampleMessages(channelId, workspaceId);
    set((state) => ({ messages: [...state.messages, ...channelMessages] }));
  },

  initializeDMMessages: (dmUserId: string, workspaceId: string) => {
    const existing = get().messages.find(
      (msg) => msg.dmUserId === dmUserId && msg.workspaceId === workspaceId
    );
    if (existing) return; // Already initialized

    const dmMessages = getDMSampleMessages(dmUserId, workspaceId);
    set((state) => ({ messages: [...state.messages, ...dmMessages] }));
  },

  addReaction: (messageId: string, emoji: string) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions.find((r) => r.emoji === emoji)
                ? msg.reactions.map((r) =>
                    r.emoji === emoji ? { ...r, count: r.count + 1 } : r
                  )
                : [...msg.reactions, { emoji, count: 1 }],
            }
          : msg
      ),
    })),

  removeReaction: (messageId: string, emoji: string) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions
                .map((r) =>
                  r.emoji === emoji ? { ...r, count: r.count - 1 } : r
                )
                .filter((r) => r.count > 0),
            }
          : msg
      ),
    })),

  toggleReaction: (messageId: string, emoji: string) => {
    const state = get();
    const message = state.messages.find((msg) => msg.id === messageId);
    if (!message) return;

    const existingReaction = message.reactions.find((r) => r.emoji === emoji);
    if (existingReaction) {
      state.removeReaction(messageId, emoji);
    } else {
      state.addReaction(messageId, emoji);
    }
  },
}));

// Sample data generators
function getChannelSampleMessages(
  channelId: string,
  workspaceId: string
): MessageItemModel[] {
  const baseMessages = {
    "1": [
      // General channel
      {
        id: `${channelId}-1`,
        avatarUrl: avatarUrl.src,
        name: "Sarah Miller",
        time: "1h ago",
        message:
          "Good morning everyone! Hope you're all having a great start to the week. 🌟",
        reactions: [
          { emoji: "👋", count: 5 },
          { emoji: "☕", count: 3 },
        ],
        channelId,
        workspaceId,
      },
      {
        id: `${channelId}-2`,
        avatarUrl: avatarUrl.src,
        name: "Mike Chen",
        time: "45m ago",
        message: "Don't forget about our team standup at 10 AM today!",
        mentions: ["@team"],
        reactions: [{ emoji: "✅", count: 8 }],
        channelId,
        workspaceId,
      },
    ],
    "2": [
      // Development channel
      {
        id: `${channelId}-1`,
        avatarUrl: avatarUrl.src,
        name: "Alex Rodriguez",
        time: "2h ago",
        message:
          "I've pushed the latest changes to the feature branch. The new authentication flow is ready for review.",
        reactions: [{ emoji: "🚀", count: 4 }],
        channelId,
        workspaceId,
      },
      {
        id: `${channelId}-2`,
        avatarUrl: avatarUrl.src,
        name: "Emma Thompson",
        time: "1h ago",
        message:
          "Great work @Alex! I'll review the PR this afternoon and test the edge cases.",
        mentions: ["@Alex"],
        reactions: [{ emoji: "👍", count: 2 }],
        channelId,
        workspaceId,
      },
    ],
    "3": [
      // Design channel
      {
        id: `${channelId}-1`,
        avatarUrl: avatarUrl.src,
        name: "Luna Parker",
        time: "3h ago",
        message:
          "Here's the updated mockup for the dashboard redesign. What do you think?",
        hasAttachment: true,
        attachmentTitle: "Dashboard_v3_mockup.fig",
        attachmentUrl: "figma.com/design/dashboard-v3",
        showQuickView: true,
        reactions: [
          { emoji: "🎨", count: 6 },
          { emoji: "✨", count: 4 },
        ],
        channelId,
        workspaceId,
      },
      {
        id: `${channelId}-2`,
        avatarUrl: avatarUrl.src,
        name: "Jordan Kim",
        time: "2h ago",
        message:
          "Love the new color palette! The contrast ratios look perfect for accessibility.",
        reactions: [{ emoji: "💚", count: 3 }],
        channelId,
        workspaceId,
      },
    ],
    "6": [
      // UI-Kit Design channel (nested)
      {
        id: `${channelId}-1`,
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
        channelId,
        workspaceId,
      },
      {
        id: `${channelId}-2`,
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
        channelId,
        workspaceId,
      },
      {
        id: `${channelId}-3`,
        avatarUrl: avatarUrl.src,
        name: "Daniel A.",
        time: "3h ago",
        message:
          "Okay, keep me updated. @Diana T. I also wanted to remind you to keep the layers organized.",
        mentions: ["@Diana"],
        reactions: [],
        channelId,
        workspaceId,
      },
      {
        id: `${channelId}-4`,
        avatarUrl: avatarUrl.src,
        name: "Daniel A.",
        time: "2h 58m ago",
        message:
          "Also, let's document any custom tokens we add so devs can reference them easily.",
        reactions: [{ emoji: "✅", count: 1 }],
        channelId,
        workspaceId,
      },
      {
        id: `${channelId}-5`,
        avatarUrl: avatarUrl.src,
        name: "Emily D.",
        time: "1h ago",
        message: "Here's the latest header hero exploration.",
        reactions: [{ emoji: "🔥", count: 3 }],
        imageUrl: avatarUrl.src,
        imageAlt: "Header hero exploration preview",
        channelId,
        workspaceId,
      },
      {
        id: `${channelId}-6`,
        avatarUrl: avatarUrl.src,
        name: "User",
        time: "just now",
        message: "Looks great! Let's share this with @Management for sign-off.",
        mentions: ["@Management"],
        reactions: [],
        channelId,
        workspaceId,
      },
    ],
  };

  return (
    baseMessages[channelId as keyof typeof baseMessages] || [
      {
        id: `${channelId}-default`,
        avatarUrl: avatarUrl.src,
        name: "System",
        time: "now",
        message: `Welcome to this channel! This is the beginning of your conversation.`,
        reactions: [],
        channelId,
        workspaceId,
      },
    ]
  );
}

function getDMSampleMessages(
  dmUserId: string,
  workspaceId: string
): MessageItemModel[] {
  const dmMessages = {
    user1: [
      {
        id: `dm-${dmUserId}-1`,
        avatarUrl: avatarUrl.src,
        name: "Alice Johnson",
        time: "10m ago",
        message:
          "Hey! How's the project going? I saw the latest updates and they look amazing!",
        reactions: [],
        dmUserId,
        workspaceId,
      },
      {
        id: `dm-${dmUserId}-2`,
        avatarUrl: avatarUrl.src,
        name: "You",
        time: "5m ago",
        message:
          "Thanks Alice! We're making great progress. Should have the first milestone ready by Friday.",
        reactions: [{ emoji: "👍", count: 1 }],
        dmUserId,
        workspaceId,
      },
    ],
    user2: [
      {
        id: `dm-${dmUserId}-1`,
        avatarUrl: avatarUrl.src,
        name: "Bob Smith",
        time: "2h ago",
        message:
          "Let's review the designs tomorrow. I have some feedback on the navigation flow.",
        reactions: [],
        dmUserId,
        workspaceId,
      },
      {
        id: `dm-${dmUserId}-2`,
        avatarUrl: avatarUrl.src,
        name: "You",
        time: "1h ago",
        message: "Sounds good! What time works for you? I'm free after 2 PM.",
        reactions: [],
        dmUserId,
        workspaceId,
      },
    ],
    user3: [
      {
        id: `dm-${dmUserId}-1`,
        avatarUrl: avatarUrl.src,
        name: "Carol Davis",
        time: "1d ago",
        message:
          "Thanks for the code review! I've addressed all your comments.",
        reactions: [{ emoji: "✅", count: 1 }],
        dmUserId,
        workspaceId,
      },
    ],
  };

  return (
    dmMessages[dmUserId as keyof typeof dmMessages] || [
      {
        id: `dm-${dmUserId}-default`,
        avatarUrl: avatarUrl.src,
        name: "System",
        time: "now",
        message: "This is the start of your conversation.",
        reactions: [],
        dmUserId,
        workspaceId,
      },
    ]
  );
}
