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
    
    // Kiểm tra xem có phải là request login không
    const isLoginRequest = originalRequest.url?.includes('/auth/login');
    // Kiểm tra các request auth khác
    const isAuthRequest = originalRequest.url?.includes('/auth');
    
    // Nếu là request login và lỗi 400 (sai thông tin đăng nhập), trả về lỗi ngay lập tức
    if (isLoginRequest && error.response?.status === 400) {
      return Promise.reject(error);
    }
    
    // Xử lý refresh token cho các request khác khi token hết hạn (401)
    if (error.response?.status === 401 && 
        !isAuthRequest && 
        originalRequest && 
        !originalRequest._retry && 
        !originalRequest.skipAuthRefresh) {
      originalRequest._retry = true;
      
      try {
        const response = await axiosInstance.post<ApiSuccessResponse<{ access_token: string }>>('/auth/refresh', null, { 
          skipAuthRefresh: true,
          withCredentials: true
        });
        
        const access_token = response.data.data.access_token;
        
        localStorage.setItem('access_token', access_token);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        if (!originalRequest.url?.includes('/auth/logout')) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;