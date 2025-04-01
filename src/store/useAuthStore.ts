import { create } from 'zustand';
import { User } from '@/types/auth';
import { setAccessToken, clearAccessToken } from '@/api/axios.config';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoadingUser: boolean;
}

interface AuthStore extends AuthState {
  setAuth: (user: User | null, token: string | null) => void;
  clearAuth: () => void;
  setLoadingUser: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  isLoadingUser: false,

  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('access_token', token);
      setAccessToken(token);
    }
    else if (user) {
      const currentToken = localStorage.getItem('access_token');
      if (currentToken) {
        setAccessToken(currentToken);
        set({ user, token: currentToken });
        return;
      }
    }
    set({ user, token });
  },

  clearAuth: () => {
    localStorage.removeItem('access_token');
    clearAccessToken();
    set({
      user: null,
      token: null,
      isLoadingUser: false
    });
  },
  setLoadingUser: (isLoading: boolean) => {
    set({ isLoadingUser: isLoading });
  },
}));

export const useAuth = () => {
  const { user, token, isLoadingUser } = useAuthStore();
  return { user, token, isLoadingUser };
};

export const useAuthActions = () => {
  const { setAuth, clearAuth, setLoadingUser } = useAuthStore();
  return { setAuth, clearAuth, setLoadingUser };
};