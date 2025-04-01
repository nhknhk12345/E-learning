import { ApiSuccessResponse } from "./response";

export interface User {
    _id: string;
    username: string;
    email: string;
    role: 'admin' | 'user';
    isVerified: boolean;
    avatarUrl: string | null;
    balance: number;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface LoginData {
    user: User;
    access_token: string;
}
export interface RefreshTokenData {
    access_token: string;
}

export type LoginResponse = ApiSuccessResponse<LoginData>;
export type RefreshTokenResponse = ApiSuccessResponse<RefreshTokenData>;

export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
}