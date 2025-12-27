import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../utils/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        
        // Actually backend sends: { status: 'success', token, data: { user } }
        const tokenVal = response.data.token;
        const userVal = response.data.data.user;

        set({ user: userVal, token: tokenVal });
      },
      register: async (data) => {
         const response = await api.post('/auth/register', data);
         const tokenVal = response.data.token;
         const userVal = response.data.data.user;
         set({ user: userVal, token: tokenVal });
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

