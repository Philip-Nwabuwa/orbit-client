import { create } from "zustand";

interface Channel {
  id: string;
  name: string;
  type: "public" | "private" | "direct";
  members: string[];
  unreadCount: number;
  icon?: string;
  description?: string;
  isActive?: boolean;
  isFavorite?: boolean;
  favoritedAt?: Date;
  parentId?: string; // For nested channels
  children?: Channel[]; // Sub-channels
}

interface ChannelState {
  channels: Channel[];
  addChannel: (channel: Channel) => void;
  updateUnreadCount: (channelId: string, count: number) => void;
  toggleFavorite: (channelId: string) => void;
  initializeChannels: () => void;
  getChannelHierarchy: () => Channel[];
}

export const useChannelStore = create<ChannelState>((set, get) => ({
  channels: [],
  addChannel: (channel) =>
    set((state) => ({ channels: [...state.channels, channel] })),
  updateUnreadCount: (channelId, count) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === channelId ? { ...ch, unreadCount: count } : ch
      ),
    })),
  toggleFavorite: (channelId) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === channelId
          ? {
              ...ch,
              isFavorite: !ch.isFavorite,
              favoritedAt: !ch.isFavorite ? new Date() : undefined,
            }
          : ch
      ),
    })),

  getChannelHierarchy: (): Channel[] => {
    const state = get();

    // Recursive function to build hierarchy
    const buildChannelTree = (parentId?: string): Channel[] => {
      const children = state.channels.filter(
        (ch: Channel) => ch.parentId === parentId
      );

      return children.map((channel: Channel) => ({
        ...channel,
        children: buildChannelTree(channel.id),
      }));
    };

    // Get top-level channels (no parentId) and build their trees
    return buildChannelTree();
  },
  initializeChannels: () =>
    set({
      channels: [
        {
          id: "1",
          name: "General",
          type: "public",
          members: ["user1", "user2", "user3"],
          unreadCount: 123,
          icon: "#",
          description: "General discussions and announcements",
          isActive: true,
          isFavorite: true,
          favoritedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: "2",
          name: "Development",
          type: "public",
          members: ["user1", "user4", "user5"],
          unreadCount: 42,
          icon: "#",
          description: "Development discussions and code reviews",
        },
        {
          id: "3",
          name: "Design",
          type: "public",
          members: ["user2", "user6"],
          unreadCount: 7,
          icon: "#",
          description: "Design discussions and creative collaboration",
          isFavorite: true,
          favoritedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        },
        // Parent channel: Website
        {
          id: "4",
          name: "Website",
          type: "public",
          members: ["user1", "user2", "user3", "user4"],
          unreadCount: 5,
          icon: "#",
          description: "Website project discussions",
        },
        // Child channels under Website
        {
          id: "5",
          name: "v1.0",
          type: "public",
          members: ["user1", "user2", "user3"],
          unreadCount: 3,
          icon: "#",
          description: "Version 1.0 development",
          parentId: "4",
        },
        // Nested child under v1.0
        {
          id: "6",
          name: "UI-Kit Design",
          type: "public",
          members: ["user2", "user6"],
          unreadCount: 8,
          icon: "#",
          description: "UI Kit design and components",
          parentId: "5",
        },
        {
          id: "7",
          name: "Backend API",
          type: "public",
          members: ["user1", "user4"],
          unreadCount: 12,
          icon: "#",
          description: "Backend API development",
          parentId: "5",
        },
        {
          id: "8",
          name: "v2.0",
          type: "public",
          members: ["user1", "user3", "user5"],
          unreadCount: 0,
          icon: "#",
          description: "Future v2.0 planning",
          parentId: "4",
        },
        {
          id: "9",
          name: "Random",
          type: "public",
          members: ["user1", "user2", "user3", "user4"],
          unreadCount: 0,
          icon: "#",
          description: "Random conversations and fun stuff",
        },
        {
          id: "10",
          name: "Private Project",
          type: "private",
          members: ["user1", "user2"],
          unreadCount: 15,
          icon: "#",
          description: "Private project discussions",
        },
      ],
    }),
}));
