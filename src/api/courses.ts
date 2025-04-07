import { axiosInstance } from '@/api/axios.config';
import type { ApiResponse, CoursesResponse, Course } from '@/types/course';
import { PurchaseResponse } from '@/types/purchase';

interface GetAllCoursesParams {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  sortBy?: string;
}

export const courseApi = {
  getAllCourses: async (params: GetAllCoursesParams = {}): Promise<ApiResponse<CoursesResponse>> => {
    const response = await axiosInstance.get('/course', { 
      params,
      skipAuthRefresh: true
    });
    return response.data;
  },

  getFeaturedCourses: async (): Promise<ApiResponse<CoursesResponse>> => {
    const response = await axiosInstance.get('/course/featured', {
      skipAuthRefresh: true
    });
    return response.data;
  },

  getNewCourses: async (): Promise<ApiResponse<CoursesResponse>> => {
    const response = await axiosInstance.get('/course/new', {
      skipAuthRefresh: true
    });
    return response.data;
  },

  // Các endpoints cần auth
  getCourseById: async (id: string): Promise<ApiResponse<Course>> => {
    const response = await axiosInstance.get(`/course/${id}`);
    return response.data;
  },

  createCourse: async (formData: FormData): Promise<ApiResponse<Course>> => {
    const response = await axiosInstance.post('/course', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateCourse: async (id: string, formData: FormData): Promise<ApiResponse<Course>> => {
    const response = await axiosInstance.patch(`/course/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCourse: async (id: string): Promise<ApiResponse<void>> => {
    const response = await axiosInstance.delete(`/course/${id}`);
    return response.data;
  },

  purchaseCourse: async (courseId: string) => {
    const response = await axiosInstance.post<ApiResponse<PurchaseResponse>>('/purchase-history/purchase', {
      courseId
    });
    return response.data;
  },
};