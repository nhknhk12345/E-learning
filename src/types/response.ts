export interface ApiSuccessResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    response?: {
        status: number;
        data?: {
            message: string;
        }
    }
}