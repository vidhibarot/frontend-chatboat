import { create } from 'zustand';

export interface Message {
  id: string;
  session_id: string;
  senderType: 'user' | 'admin';
  sender_id: string | null;
  content: string;
  is_read: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface ChatStore {
  currentSessionId: string | null;
  messages: Message[];
  isTyping: boolean;
  adminIsTyping: boolean;
  setCurrentSessionId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setIsTyping: (isTyping: boolean) => void;
  setAdminIsTyping: (isTyping: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  currentSessionId: null,
  messages: [],
  isTyping: false,
  adminIsTyping: false,
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setIsTyping: (isTyping) => set({ isTyping }),
  setAdminIsTyping: (isTyping) => set({ adminIsTyping: isTyping }),
}));
