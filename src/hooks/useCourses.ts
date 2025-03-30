import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi, Course } from '@/api/courses';
import { useAuthStore } from '@/store/useAuthStore';

export const useCourses = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // Fetch all courses
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: coursesApi.getAllCourses,
    enabled: !!token, // Only fetch if user is authenticated
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: coursesApi.createCourse,
    onSuccess: () => {
      // Invalidate and refetch courses query
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Course> }) =>
      coursesApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: coursesApi.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  return {
    courses,
    isLoading,
    error,
    createCourse: createCourseMutation.mutate,
    updateCourse: updateCourseMutation.mutate,
    deleteCourse: deleteCourseMutation.mutate,
    isCreating: createCourseMutation.isPending,
    isUpdating: updateCourseMutation.isPending,
    isDeleting: deleteCourseMutation.isPending,
  };
};

// Hook for fetching a single course
export const useCourse = (courseId: number) => {
  const { token } = useAuthStore();

  return useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => coursesApi.getCourseById(courseId),
    enabled: !!token && !!courseId,
  });
};