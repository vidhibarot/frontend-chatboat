import { create } from 'zustand';

interface Admin {
  id: string;
  email: string;
  fullName?: string;
}

interface AuthStore {
  admin: Admin | null;
  token: string | null;
  setAdmin: (admin: Admin | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  admin: null,
  token: localStorage.getItem('authToken'),
  setAdmin: (admin) => set({ admin }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('authToken');
    set({ admin: null, token: null });
  },
}));
