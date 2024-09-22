
import { create } from 'zustand';
interface AuthState {
  token: string | null;
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user:User) => set({user}),
  clearAuth: () => set({ token: null, user: null }),
}));
