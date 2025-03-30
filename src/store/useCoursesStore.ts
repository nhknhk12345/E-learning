import { create } from 'zustand';
import { Course } from '@/api/courses';

interface CoursesState {
  courses: Course[];
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course | null) => void;
  setCourses: (courses: Course[]) => void;
  filterCourses: (searchTerm: string) => Course[];
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  selectedCourse: null,

  setSelectedCourse: (course) => set({ selectedCourse: course }),
  
  setCourses: (courses) => set({ courses }),
  
  filterCourses: (searchTerm) => {
    const { courses } = get();
    if (!searchTerm) return courses;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return courses.filter((course) =>
      course.title.toLowerCase().includes(lowercaseSearch) ||
      course.description.toLowerCase().includes(lowercaseSearch)
    );
  },
}));

// Example of how to sync React Query data with Zustand
export const useSyncCoursesStore = () => {
  const setCourses = useCoursesStore((state) => state.setCourses);

  const syncCourses = (courses: Course[]) => {
    setCourses(courses);
  };

  return { syncCourses };
};