import { useEffect } from 'react';
import { useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';
import { authApi } from '@/api/authentication';
import { LoginRequest, RegisterRequest, LoginResponse, User } from '@/types/auth';
import { useAuth as useAuthStore, useAuthActions } from '@/store/useAuthStore';
import { ApiSuccessResponse } from '@/types/response';

export const useAuth = () => {
  const { token } = useAuthStore();
  const { setAuth, clearAuth, setLoadingUser } = useAuthActions();

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

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.data.user, data.data.access_token);
    }
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authApi.register(userData),
    onSuccess: (data) => {
      console.log('Register success:', data);
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
    },
    onError: () => {
      clearAuth();
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
      options?: Omit<UseMutationOptions<LoginResponse, Error, LoginRequest>, 'mutationFn'>
    ) => {
      return loginMutation.mutate(credentials, {
        ...options,
        onSuccess: (data, variables, context) => {
          setAuth(data.data.user, data.data.access_token);
          options?.onSuccess?.(data, variables, context);
        }
      });
    },
    register: (
      userData: RegisterRequest,
      options?: Omit<UseMutationOptions<ApiSuccessResponse<User>, Error, RegisterRequest>, 'mutationFn'>
    ) => {
      return registerMutation.mutate(userData, options);
    },
    logout: (
      options?: Omit<UseMutationOptions<void, Error, void>, 'mutationFn'>
    ) => {
      return logoutMutation.mutate(undefined, {
        ...options,
        onSuccess: (data, variables, context) => {
          clearAuth();
          options?.onSuccess?.(data, variables, context);
        }
      });
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