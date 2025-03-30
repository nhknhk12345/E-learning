import axiosInstance from './axios.config';

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: {
    id: number;
    name: string;
  };
  thumbnail: string;
  totalLessons: number;
}

export const coursesApi = {
  getAllCourses: async (): Promise<Course[]> => {
    const response = await axiosInstance.get('/courses');
    return response.data;
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response = await axiosInstance.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData: Omit<Course, 'id'>): Promise<Course> => {
    const response = await axiosInstance.post('/courses', courseData);
    return response.data;
  },

  updateCourse: async (id: number, courseData: Partial<Course>): Promise<Course> => {
    const response = await axiosInstance.put(`/courses/${id}`, courseData);
    return response.data;
  },

  deleteCourse: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/courses/${id}`);
  },
};