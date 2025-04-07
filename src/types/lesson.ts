import { Lecture } from './lecture';

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  order: number;
  courseId: string;
  isDeleted: boolean;
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lectures: Lecture[];
}

export interface CreateLessonDto {
  title: string;
  description: string;
  courseId: string;
}

export interface UpdateLessonDto {
  title?: string;
  description?: string;
} 