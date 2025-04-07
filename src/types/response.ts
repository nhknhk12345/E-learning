export interface ApiSuccessResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface ApiErrorData {
    message: string;
    code?: string;
    field?: string;
    details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
    response: {
        status: number;
        data: ApiErrorData;
    };
}