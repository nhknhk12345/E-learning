export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: CourseLevel;
  lessons: any[];
  isDeleted: boolean;
  enrolledStudents: number;
  averageRating: number;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface CoursesResponse {
  courses: Course[];
} 