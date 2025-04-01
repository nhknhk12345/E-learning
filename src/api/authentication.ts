import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types/auth';
import { ApiSuccessResponse } from '../types/response';
import axiosInstance from './axios.config';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: RegisterRequest): Promise<ApiSuccessResponse<User>> => {
        const response = await axiosInstance.post<ApiSuccessResponse<User>>('/auth/register', userData);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await axiosInstance.post('/auth/logout');
    },

    getMe: async (): Promise<ApiSuccessResponse<User>> => {
        const response = await axiosInstance.get<ApiSuccessResponse<User>>('/auth/me');
        return response.data;
    },

    // Lấy URL để chuyển hướng đến Google OAuth
    getGoogleOAuthUrl: () => {
        return `${axiosInstance.defaults.baseURL}/auth/google`;
    }
};