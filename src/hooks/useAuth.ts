"use client";

import { useEffect } from 'react';
import { useMutation, useQuery, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/authentication';
import { LoginRequest, RegisterRequest, LoginResponse, User } from '@/types/auth';
import { useAuthActions } from '@/store/useAuthStore';
import { ApiSuccessResponse, ApiErrorResponse } from '@/types/response';

export const useAuth = () => {
  const { setAuth, setLoadingUser, logout } = useAuthActions();
  const queryClient = useQueryClient();

  const { data: authData, isPending } = useQuery<ApiSuccessResponse<User>, Error>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authApi.getMe();
      return response;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setLoadingUser(isPending);
  }, [isPending, setLoadingUser]);

  useEffect(() => {
    if (authData?.data) {
      const token = localStorage.getItem('access_token');
      setAuth(authData.data, token || '');
    }
  }, [authData?.data, setAuth]);

  const loginMutation = useMutation<ApiSuccessResponse<LoginResponse>, ApiErrorResponse, LoginRequest>({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.access_token);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    }
  });

  const registerMutation = useMutation<ApiSuccessResponse<User>, ApiErrorResponse, RegisterRequest>({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData)
  });

  const logoutMutation = useMutation<ApiSuccessResponse<{ message: string }>, ApiErrorResponse, void>({
    mutationFn: async () => {
      try {
        const response = await authApi.logout();
        return response;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      logout();
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
    },
    onError: () => {
      logout();
      queryClient.removeQueries({ queryKey: ['auth', 'me'] });
    }
  });

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
    logoutError: logoutMutation.error
  };
};