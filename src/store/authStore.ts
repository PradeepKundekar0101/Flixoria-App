import { create } from 'zustand';
import { getToken, getUser } from '../utils/storage'; 

interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  loadTokenFromStorage: () => Promise<void>; 
  loadUserFromStorage: () => Promise<void>; 
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
  loadUserFromStorage: async () => {
    const storedUser = await getUser(); 
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
}));
