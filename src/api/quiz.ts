import { axiosInstance } from "./axios.config";
import { ApiResponse } from "@/types/lecture";
import { QuizQuestion } from "@/store/useQuizStore";

export interface CreateQuizDto {
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  lectureId: string;
}

export interface UpdateQuizDto {
  title?: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  lectureId?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  lectureId: string;
  createdAt: string;
  updatedAt: string;
}

export const quizApi = {
  getAllQuizzes: async (params: { page: number; limit: number }) => {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>(`/quiz`, { params });
    return response.data;
  },

  getQuiz: async (quizId: string) => {
    const response = await axiosInstance.get<ApiResponse<Quiz>>(`/quiz/${quizId}`);
    return response.data;
  },

  createQuiz: async (data: CreateQuizDto) => {
    const response = await axiosInstance.post<ApiResponse<Quiz>>(`/quiz`, data);
    return response.data;
  },

  updateQuiz: async (quizId: string, data: UpdateQuizDto) => {
    const response = await axiosInstance.put<ApiResponse<Quiz>>(`/quiz/${quizId}`, data);
    return response.data;
  },

  deleteQuiz: async (quizId: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/quiz/${quizId}`);
    return response.data;
  },

  // Quiz Questions API
  getQuestionsByQuiz: async (quizId: string) => {
    const response = await axiosInstance.get<ApiResponse<{ questions: QuizQuestion[] }>>(`/quiz-questions/quiz/${quizId}`);
    return response.data;
  },

  addQuestion: async (quizId: string, question: Omit<QuizQuestion, "_id">) => {
    const response = await axiosInstance.post<ApiResponse<QuizQuestion>>(`/quiz-questions`, {
      ...question,
      quizId,
    });
    return response.data;
  },

  updateQuestion: async (questionId: string, question: QuizQuestion) => {
    const response = await axiosInstance.put<ApiResponse<QuizQuestion>>(`/quiz-questions/${questionId}`, question);
    return response.data;
  },

  deleteQuestion: async (questionId: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/quiz-questions/${questionId}`);
    return response.data;
  },
}; 