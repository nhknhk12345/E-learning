import { create } from 'zustand';
import { AuthState, User } from '@/types/auth';
import axiosInstance from '@/api/axios.config';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,

  setUser: (user: User | null) => set({ user }),

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      set({
        user,
        token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'An error occurred during login',
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      error: null,
    });
  },
}));

// Hook for accessing auth state in components
export const useAuth = () => {
  const { user, token, isLoading, error } = useAuthStore();
  return { user, token, isLoading, error };
};

// Hook for accessing auth actions in components
export const useAuthActions = () => {
  const { login, logout, setUser } = useAuthStore();
  return { login, logout, setUser };
};