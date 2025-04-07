import { ApiResponse } from "@/types/lecture";
import { axiosInstance } from "./axios.config";
import type { Lesson, CreateLessonDto, UpdateLessonDto } from "@/types/lesson";

export const lessonApi = {
  getAllLessons: async (params: { page: number; limit: number }): Promise<ApiResponse<Lesson[]>> => {
    const response = await axiosInstance.get(`/lesson`, { params });
    return response.data;
  },

  getLesson: async (lessonId: string): Promise<ApiResponse<Lesson>> => {
    const response = await axiosInstance.get(`/lesson/${lessonId}`);
    return response.data;
  },

  getLessonsByCourse: (courseId: string) => {
    return axiosInstance.get<ApiResponse<Lesson[]>>(`/courses/${courseId}/lessons`);
  },

  createLesson: (data: CreateLessonDto) => {
    return axiosInstance.post<ApiResponse<Lesson>>(`/lesson`, data);
  },

  updateLesson: (lessonId: string, data: UpdateLessonDto) => {
    return axiosInstance.put<ApiResponse<Lesson>>(`/lesson/update/${lessonId}`, data);
  },

  deleteLesson: (lessonId: string) => {
    return axiosInstance.delete<ApiResponse<void>>(`/lesson/delete/${lessonId}`);
  },
}; 