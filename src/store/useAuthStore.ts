import { create } from 'zustand';
import type { User } from '@/types/auth';
import axios from 'axios';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoadingUser: boolean;
  setUser: (user: User | null) => void;
  updateUser: (user: Partial<User>) => void;
  setToken: (token: string | null) => void;
  setLoadingUser: (isLoading: boolean) => void;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => Promise<void>;
}

const logoutAPI = async (token: string) => {
  try {
    const response = await axios.post('/api/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

const clearAuthData = () => {
  // Xóa dữ liệu trong localStorage trước
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  
  // Sau đó reset state
  useAuthStore.setState({ user: null, token: null, isLoadingUser: false });
  
  // Cuối cùng là refresh page
  window.location.href = '/auth/login';
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  token: null,
  isLoadingUser: true,
  setUser: (user) => set({ user }),
  updateUser: (userData) => set((state) => ({
    user: state.user ? { ...state.user, ...userData } : null
  })),
  setToken: (token) => set({ token }),
  setLoadingUser: (isLoading) => set({ isLoadingUser: isLoading }),
  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('access_token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      set({ user, token, isLoadingUser: false });
    } else if (user) {
      const currentToken = localStorage.getItem('access_token');
      if (currentToken) {
        localStorage.setItem('access_token', currentToken);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token: currentToken, isLoadingUser: false });
      } else {
        set({ user, token: null, isLoadingUser: false });
      }
    } else {
      set({ user: null, token: null, isLoadingUser: false });
    }
  },
  logout: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      clearAuthData();
      return;
    }

    try {
      await logoutAPI(token);
      clearAuthData();
    } catch (error) {
      console.error('Logout failed:', error);
      // Vẫn clear data ngay cả khi API call thất bại
      clearAuthData();
    }
  },
}));

export const useAuth = () => {
  const { user, token, isLoadingUser } = useAuthStore();
  return { user, token, isLoadingUser };
};

export const useAuthActions = () => {
  const { setUser, updateUser, setToken, setLoadingUser, setAuth, logout } = useAuthStore();
  return { setUser, updateUser, setToken, setLoadingUser, setAuth, logout };
};