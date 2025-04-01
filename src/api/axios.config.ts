import { RefreshTokenResponse } from '@/types/auth';
import { ApiErrorResponse } from '@/types/response';
import axios, { AxiosError } from 'axios';
import { env } from '@/config/env.config';
import { useAuthStore } from '@/store/useAuthStore';

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

let accessToken: string | null = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

export const axiosInstance = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest) {
      const errorMessage = error.response.data?.message || 'Unauthorized';
      console.error(errorMessage);

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh');
        const newAccessToken = response.data.data.access_token;
        
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        
        return axiosInstance(originalRequest);
      } catch (error) {
        const refreshError = error instanceof Error ? error : new Error('Failed to refresh token');
        processQueue(refreshError, null);

        const store = useAuthStore.getState();
        store.setLoadingUser(false);
        store.clearAuth();
        return Promise.reject({
          ...refreshError,
          __handled: true
        });
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;