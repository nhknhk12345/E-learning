import axios from './axios.config';
import { LoginRequest, RegisterRequest, LoginResponse, User } from '@/types/auth';
import { ApiSuccessResponse } from '@/types/response';

const BASE_URL = '/auth';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<ApiSuccessResponse<LoginResponse>> => {
        const response = await axios.post(`${BASE_URL}/login`, credentials);
        return response.data;
    },

    register: async (userData: RegisterRequest): Promise<ApiSuccessResponse<User>> => {
        const response = await axios.post(`${BASE_URL}/register`, userData);
        return response.data;
    },

    logout: async (): Promise<ApiSuccessResponse<{ message: string }>> => {
        const response = await axios.post(`${BASE_URL}/logout`);
        return response.data;
    },

    getMe: async (): Promise<ApiSuccessResponse<User>> => {
        const response = await axios.get(`${BASE_URL}/me`);
        return response.data;
    },

    refreshToken: async (): Promise<ApiSuccessResponse<{ access_token: string }>> => {
        const response = await axios.post(`${BASE_URL}/refresh`);
        return response.data;
    },

    // Lấy URL để chuyển hướng đến Google OAuth
    getGoogleOAuthUrl: (): string => {
        return `${process.env.NEXT_PUBLIC_API_URL}${BASE_URL}/google`;
    },

    // Xác thực email
    verifyEmail: async (email: string, token: string): Promise<ApiSuccessResponse<{ message: string }>> => {
        const response = await axios.post(`${BASE_URL}/verify-email/${token}`, { email });
        return response.data;
    },

    // Gửi lại mã xác thực
    resendVerificationCode: async (email: string): Promise<ApiSuccessResponse<{ message: string }>> => {
        const response = await axios.post(`${BASE_URL}/resend-verification-email`, { email });
        return response.data;
    }
};