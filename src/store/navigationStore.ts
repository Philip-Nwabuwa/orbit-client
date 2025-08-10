import { create } from "zustand";

type NavigationType = "channel" | "directMessage" | null;

interface NavigationState {
  activeType: NavigationType;
  activeId: string | null;
  workspaceId: string;
  setActiveChannel: (channelId: string) => void;
  setActiveDirectMessage: (userId: string) => void;
  setWorkspaceId: (workspaceId: string) => void;
  clearActive: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeType: null,
  activeId: null,
  workspaceId: "yrgGdg234j", // Default workspace ID

  setActiveChannel: (channelId: string) =>
    set({
      activeType: "channel",
      activeId: channelId,
    }),

  setActiveDirectMessage: (userId: string) =>
    set({
      activeType: "directMessage",
      activeId: userId,
    }),

  setWorkspaceId: (workspaceId: string) => set({ workspaceId }),

  clearActive: () =>
    set({
      activeType: null,
      activeId: null,
    }),
}));
