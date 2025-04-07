import { ApiSuccessResponse } from "./response";

export interface User {
    _id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    role: string;
    isVerified: boolean;
    status: 'active' | 'inactive';
    balance: number;
    enrolledCourses: string[];
    completedCourses: string[];
    boughtCourses?: string[];
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    username: string;
}

export interface LoginResponse {
    user: User;
    access_token: string;
}

export interface RefreshTokenData {
    access_token: string;
}

export type RefreshTokenResponse = ApiSuccessResponse<RefreshTokenData>;