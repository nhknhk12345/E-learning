export interface ApiSuccessResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface ApiErrorResponse {
    status: number;
    message: string;
}