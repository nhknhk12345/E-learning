export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  level: CourseLevel;
  lessons: Lesson[];
  isDeleted: boolean;
  enrolledStudents: number;
  averageRating: number;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

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
  lectures: Lecture[];
}

export interface EndQuiz {
  isEnabled: boolean;
  quizId: string;
  requiredToComplete: boolean;
  minScore: number;
}

export interface Lecture {
  _id: string;
  title: string;
  description: string;
  type: 'mixed';
  order: number;
  content: {
    text: string;
    duration: number;
    videoUrl?: string;
  };
  lessonId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  endQuiz?: EndQuiz;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface CoursesResponse {
  data: {
    courses: Course[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface FeaturedCoursesResponse {
  data: {
    courses: Course[];
  };
}

export interface NewCoursesResponse {
  data: {
    courses: Course[];
  };
}