import { create } from 'zustand';
import { getToken } from '../utils/storage'; 

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  loadTokenFromStorage: () => Promise<void>; 
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user: User) => set({ user }),
  clearAuth: () => set({ token: null, user: null }),
  loadTokenFromStorage: async () => {
    const storedToken = await getToken(); 
    if (storedToken) {
      set({ token: storedToken });
    }
  },
}));
