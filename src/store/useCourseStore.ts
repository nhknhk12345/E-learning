import { create } from "zustand";
import { Course } from "@/types/course";

interface CourseStore {
  featuredCourses: Course[];
  newCourses: Course[];
  setFeaturedCourses: (courses: Course[]) => void;
  setNewCourses: (courses: Course[]) => void;
}

export const useCourseStore = create<CourseStore>((set) => ({
  featuredCourses: [],
  newCourses: [],
  setFeaturedCourses: (courses) => set({ featuredCourses: courses }),
  setNewCourses: (courses) => set({ newCourses: courses }),
})); 