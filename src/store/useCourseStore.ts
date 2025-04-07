import { create } from "zustand";
import type { Course, CourseLevel } from "@/types/course";

interface PriceRange {
  min: number;
  max: number;
}

interface Filters {
  page: number;
  search: string;
  level: CourseLevel | 'all';
  sortBy: string;
  priceRange: PriceRange;
}

interface CourseStore {
  // State
  courses: Course[];
  featuredCourses: Course[];
  newCourses: Course[];
  filters: Filters;
  isLoading: boolean;
  error: Error | null;

  // Actions
  setCourses: (courses: Course[]) => void;
  setFeaturedCourses: (courses: Course[]) => void;
  setNewCourses: (courses: Course[]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
}

const DEFAULT_PRICE_RANGE = {
  min: 0,
  max: 2000,
};

export const useCourseStore = create<CourseStore>((set) => ({
  // Initial state
  courses: [],
  featuredCourses: [],
  newCourses: [],
  filters: {
    page: 1,
    search: '',
    level: 'all',
    sortBy: 'newest',
    priceRange: DEFAULT_PRICE_RANGE,
  },
  isLoading: false,
  error: null,

  // Actions
  setCourses: (courses) => set({ courses }),
  setFeaturedCourses: (courses) => set({ featuredCourses: courses }),
  setNewCourses: (courses) => set({ newCourses: courses }),
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters },
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 