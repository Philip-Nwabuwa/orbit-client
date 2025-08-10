import { create } from 'zustand'

interface UIState {
  sidebarVisible: boolean
  infoPanelVisible: boolean
  isDarkMode: boolean
  setSidebarVisible: (visible: boolean) => void
  setInfoPanelVisible: (visible: boolean) => void
  toggleDarkMode: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarVisible: true,
  infoPanelVisible: true,
  isDarkMode: false,
  setSidebarVisible: (visible) => set({ sidebarVisible: visible }),
  setInfoPanelVisible: (visible) => set({ infoPanelVisible: visible }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode }))
}))