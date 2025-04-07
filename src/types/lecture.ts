export enum LectureType {
  VIDEO = "video",
  TEXT = "text",
  MIXED = "mixed",
}

export interface Lecture {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessonId: string;
  isDeleted: boolean;
  type: LectureType;
  content: {
    text?: string;
    video?: string;
    duration?: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateLectureDto {
  title: string;
  description: string;
  type: LectureType;
  lessonId: string;
  content?: {
    text?: string;
    video?: File;
    duration?: number;
  };
}

export interface UpdateLectureDto {
  title?: string;
  description?: string;
  type?: LectureType;
  content?: {
    text?: string;
    video?: File;
    duration?: number;
  };
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}