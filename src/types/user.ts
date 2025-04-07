export interface User {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  role: string;
  isVerified: boolean;
  status: "active" | "inactive";
  balance: number;
  enrolledCourses: string[];
  completedCourses: string[];
  boughtCourses?: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
} 