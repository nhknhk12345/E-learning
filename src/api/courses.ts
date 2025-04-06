import axios from "axios";
import { ApiResponse, CoursesResponse, Course } from "@/types/course";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const courseApi = {
  getAllCourses: async () => {
    const response = await axios.get<ApiResponse<CoursesResponse>>(
      `${BASE_URL}/course`
    );
    return response.data;
  },

  getCourseById: async (id: string) => {
    const response = await axios.get<ApiResponse<Course>>(
      `${BASE_URL}/course/${id}`
    );
    return response.data;
  },

  createCourse: async (data: Omit<Course, "_id">) => {
    const response = await axios.post<ApiResponse<Course>>(
      `${BASE_URL}/course`,
      data
    );
    return response.data;
  },

  updateCourse: async (id: string, data: Partial<Course>) => {
    const response = await axios.put<ApiResponse<Course>>(
      `${BASE_URL}/course/${id}`,
      data
    );
    return response.data;
  },

  deleteCourse: async (id: string) => {
    const response = await axios.delete<ApiResponse<void>>(
      `${BASE_URL}/course/${id}`
    );
    return response.data;
  },

  getFeaturedCourses: async () => {
    const response = await axios.get<ApiResponse<CoursesResponse>>(
      `${BASE_URL}/course/featured`
    );
    return response.data;
  },

  getNewCourses: async () => {
    const response = await axios.get<ApiResponse<CoursesResponse>>(
      `${BASE_URL}/course/new`
    );
    return response.data;
  },
};