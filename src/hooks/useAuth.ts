import { useEffect } from 'react';
import { useMutation, useQuery, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/authentication';
import { LoginRequest, RegisterRequest, LoginResponse, User } from '@/types/auth';
import { useAuth as useAuthStore, useAuthActions } from '@/store/useAuthStore';
import { ApiSuccessResponse, ApiErrorResponse } from '@/types/response';

export const useAuth = () => {
  const { token } = useAuthStore();
  const { setAuth, clearAuth, setLoadingUser } = useAuthActions();
  const queryClient = useQueryClient();

  const { data: userData, isPending, error } = useQuery<ApiSuccessResponse<User>>({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: !!token,
    retry: false
  });

  useEffect(() => {
    setLoadingUser(isPending);
  }, [isPending, setLoadingUser]);

  useEffect(() => {
    if (error) {
      setLoadingUser(false);
      clearAuth();
    }
  }, [error, setLoadingUser, clearAuth]);

  const loginMutation = useMutation<ApiSuccessResponse<LoginResponse>, ApiErrorResponse, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token);
    }
  });

  const registerMutation = useMutation<ApiSuccessResponse<User>, ApiErrorResponse, RegisterRequest>({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData)
  });

  const logoutMutation = useMutation<ApiSuccessResponse<{ message: string }>, ApiErrorResponse, void>({
    mutationFn: async () => {
      try {
        const response = await authApi.logout();
        clearAuth();
        localStorage.removeItem('access_token');
        queryClient.removeQueries({ queryKey: ['auth', 'me'] });
        return response;
      } catch (error) {
        clearAuth();
        localStorage.removeItem('access_token');
        queryClient.removeQueries({ queryKey: ['auth', 'me'] });
        throw error;
      }
    }
  });

  useEffect(() => {
    setLoadingUser(isPending);

    if (userData) {
      setAuth(userData.data, token);
    }
  }, [userData, isPending, setLoadingUser, setAuth, token]);

  const handleGoogleLogin = () => {
    const googleAuthUrl = authApi.getGoogleOAuthUrl();
    window.location.href = googleAuthUrl;
  };

  return {
    login: (
      credentials: LoginRequest,
      options?: Omit<UseMutationOptions<ApiSuccessResponse<LoginResponse>, ApiErrorResponse, LoginRequest>, 'mutationFn'>
    ) => {
      return loginMutation.mutate(credentials, options);
    },
    register: (
      userData: RegisterRequest,
      options?: Omit<UseMutationOptions<ApiSuccessResponse<User>, ApiErrorResponse, RegisterRequest>, 'mutationFn'>
    ) => {
      return registerMutation.mutate(userData, options);
    },
    logout: (
      options?: Omit<UseMutationOptions<ApiSuccessResponse<{ message: string }>, ApiErrorResponse, void>, 'mutationFn'>
    ) => {
      return logoutMutation.mutate(undefined, options);
    },
    loginWithGoogle: handleGoogleLogin,
    
    setGoogleAuth: (user: User, token: string) => {
      setAuth(user, token);
    },

    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,

    loginError: loginMutation.error,
    registerError: registerMutation.error,
    logoutError: logoutMutation.error,

    user: userData?.data ?? null
  };
};