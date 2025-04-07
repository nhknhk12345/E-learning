import { ApiResponse } from "@/types/lecture";
import { axiosInstance } from "./axios.config";
import type { Lecture, CreateLectureDto, UpdateLectureDto } from "@/types/lecture";

export const lectureApi = {
  getAllLectures: async (params: { page: number; limit: number }): Promise<ApiResponse<Lecture[]>> => {
    const response = await axiosInstance.get(`/lectures`, { params });
    return response.data;
  },

  getLecture: async (lectureId: string): Promise<ApiResponse<Lecture>> => {
    const response = await axiosInstance.get(`/lectures/${lectureId}`);
    return response.data;
  },

  getLecturesByLesson: (lessonId: string) => {
    return axiosInstance.get<ApiResponse<Lecture[]>>(`/lesson/${lessonId}/lectures`);
  },

  createLecture: (data: CreateLectureDto) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("lessonId", data.lessonId);
    
    if (data.content?.text) {
      formData.append("content.text", data.content.text);
    }
    
    if (data.content?.video) {
      formData.append("content.video", data.content.video);
    }
    
    if (data.content?.duration) {
      formData.append("content.duration", data.content.duration.toString());
    }

    return axiosInstance.post<ApiResponse<Lecture>>(`/lectures`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateLecture: (lectureId: string, data: UpdateLectureDto) => {
    const formData = new FormData();
    
    if (data.title) {
      formData.append("title", data.title);
    }
    
    if (data.description) {
      formData.append("description", data.description);
    }
    
    if (data.type) {
      formData.append("type", data.type);
    }
    
    if (data.content?.text) {
      formData.append("content.text", data.content.text);
    }
    
    if (data.content?.video) {
      formData.append("content.video", data.content.video);
    }
    
    if (data.content?.duration) {
      formData.append("content.duration", data.content.duration.toString());
    }

    return axiosInstance.put<ApiResponse<Lecture>>(`/lectures/${lectureId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteLecture: (lectureId: string) => {
    return axiosInstance.delete<ApiResponse<void>>(`/lectures/${lectureId}`);
  },
}; 