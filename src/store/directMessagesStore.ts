import { create } from "zustand";

interface DirectMessage {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  isFavorite?: boolean;
  favoritedAt?: Date;
}

interface DirectMessagesState {
  directMessages: DirectMessage[];
  addDirectMessage: (dm: DirectMessage) => void;
  updateUnreadCount: (userId: string, count: number) => void;
  toggleFavorite: (userId: string) => void;
  markAsOnline: (userId: string) => void;
  markAsOffline: (userId: string) => void;
  initializeDirectMessages: () => void;
}

export const useDirectMessagesStore = create<DirectMessagesState>((set) => ({
  directMessages: [],
  addDirectMessage: (dm) =>
    set((state) => ({ directMessages: [...state.directMessages, dm] })),
  updateUnreadCount: (userId, count) =>
    set((state) => ({
      directMessages: state.directMessages.map((dm) =>
        dm.userId === userId ? { ...dm, unreadCount: count } : dm
      ),
    })),
  toggleFavorite: (userId) =>
    set((state) => ({
      directMessages: state.directMessages.map((dm) =>
        dm.userId === userId
          ? {
              ...dm,
              isFavorite: !dm.isFavorite,
              favoritedAt: !dm.isFavorite ? new Date() : undefined,
            }
          : dm
      ),
    })),
  markAsOnline: (userId) =>
    set((state) => ({
      directMessages: state.directMessages.map((dm) =>
        dm.userId === userId ? { ...dm, isOnline: true } : dm
      ),
    })),
  markAsOffline: (userId) =>
    set((state) => ({
      directMessages: state.directMessages.map((dm) =>
        dm.userId === userId ? { ...dm, isOnline: false } : dm
      ),
    })),
  initializeDirectMessages: () =>
    set({
      directMessages: [
        {
          id: "dm1",
          userId: "user1",
          userName: "Alice Johnson",
          avatar:
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=778&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          lastMessage: "Hey! How's the project going?",
          lastMessageTime: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          unreadCount: 3,
          isOnline: true,
          isFavorite: true,
          favoritedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        },
        {
          id: "dm2",
          userId: "user2",
          userName: "Bob Smith",
          avatar:
            "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          lastMessage: "Let's review the designs tomorrow",
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          unreadCount: 0,
          isOnline: true,
        },
        {
          id: "dm3",
          userId: "user3",
          userName: "Carol Davis",
          avatar:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          lastMessage: "Thanks for the code review!",
          lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          unreadCount: 1,
          isOnline: false,
        },
        {
          id: "dm4",
          userId: "user4",
          userName: "David Wilson",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          lastMessage: "Can we schedule a meeting?",
          lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          unreadCount: 0,
          isOnline: false,
          isFavorite: true,
          favoritedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        },
        {
          id: "dm5",
          userId: "user5",
          userName: "Eva Martinez",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          lastMessage: "Great work on the presentation!",
          lastMessageTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          unreadCount: 5,
          isOnline: true,
        },
      ],
    }),
}));
