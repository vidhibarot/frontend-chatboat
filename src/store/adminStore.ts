import { create } from 'zustand';
import { ChatSession } from './chatStore';

interface AdminStore {
  selectedSessionId: string | null;
  sessions: ChatSession[];
  setSelectedSessionId: (id: string | null) => void;
  setSessions: (sessions: ChatSession[]) => void;
  updateSession: (session: ChatSession) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  selectedSessionId: null,
  sessions: [],
  setSelectedSessionId: (id) => set({ selectedSessionId: id }),
  setSessions: (sessions) => set({ sessions }),
  updateSession: (session) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === session.id ? session : s)),
    })),
}));
