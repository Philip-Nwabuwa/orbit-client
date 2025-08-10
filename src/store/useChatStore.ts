import { create } from 'zustand'

interface Message {
  id: string
  content: string
  userId: string
  timestamp: Date
}

interface ChatState {
  messages: Message[]
  isTyping: boolean
  addMessage: (message: Message) => void
  setTyping: (typing: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing })
}))