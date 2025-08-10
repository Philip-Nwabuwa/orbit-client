import { create } from "zustand";
import avatarUrl from "@/assets/images/hero.jpeg";

export interface Member {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  department?: string;
  isOffline?: boolean;
}

interface MemberState {
  members: Member[];
  initializeMembers: () => void;
  addMember: (member: Member) => void;
  updateMember: (id: string, updates: Partial<Member>) => void;
  setOfflineStatus: (id: string, isOffline: boolean) => void;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],

  initializeMembers: () =>
    set({
      members: [
        {
          id: "1",
          name: "Daniel Anderson",
          role: "Art director",
          avatarUrl: avatarUrl.src,
          department: "Design",
        },
        {
          id: "2",
          name: "Andrew Miller",
          role: "Product owner",
          avatarUrl: avatarUrl.src,
          department: "Management",
        },
        {
          id: "3",
          name: "William Johnson",
          role: "UX/UI designer",
          avatarUrl: avatarUrl.src,
          department: "Design",
        },
        {
          id: "4",
          name: "Emily Davis",
          role: "Front-end dev",
          avatarUrl: avatarUrl.src,
          department: "Development",
        },
        {
          id: "5",
          name: "Sophia Wilson",
          role: "QA Engineer",
          avatarUrl: avatarUrl.src,
          isOffline: true,
        },
      ],
    }),

  addMember: (member) =>
    set((state) => ({ members: [...state.members, member] })),

  updateMember: (id, updates) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    })),

  setOfflineStatus: (id, isOffline) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id ? { ...m, isOffline } : m
      ),
    })),
}));
