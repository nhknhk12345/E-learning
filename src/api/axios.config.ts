import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
    skipAuthRefresh?: boolean;
  }
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}

interface RefreshResponse {
  access_token: string;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error | AxiosError) => void;
}> = [];

const processQueue = (error: Error | AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token được gửi:', token);
    } else {
      console.log('Không tìm thấy token trong localStorage');
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
    const originalRequest = error.config as InternalAxiosRequestConfig;

    // Nếu không phải lỗi 401 hoặc request đã được retry, reject luôn
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Nếu đang refresh token, queue request hiện tại
    if (isRefreshing) {
      try {
        const token = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    // Bắt đầu refresh token
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axiosInstance.post<ApiSuccessResponse<RefreshResponse>>(
        '/auth/refresh',
        {},
        { skipAuthRefresh: true }
      );

      const newToken = response.data.data.access_token;
      localStorage.setItem('access_token', newToken);

      // Cập nhật token cho request hiện tại
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      // Xử lý các request trong queue
      processQueue(null, newToken);

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      if (refreshError instanceof Error || refreshError instanceof AxiosError) {
        // Nếu refresh token thất bại
        processQueue(refreshError, null);
      }
      localStorage.removeItem('access_token');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;