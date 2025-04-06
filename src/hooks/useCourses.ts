import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseApi } from '@/api/courses';
import { useAuthStore } from '@/store/useAuthStore';
import { useCourseStore } from "@/store/useCourseStore";
import { useEffect } from "react";
import { Course } from '@/types/course';

export const usePublicCourses = () => {
  const { setFeaturedCourses, setNewCourses, featuredCourses, newCourses } =
    useCourseStore();

  const {
    data: featuredData,
    isLoading: isFeaturedLoading,
    error: featuredError,
  } = useQuery({
    queryKey: ["courses", "featured"],
    queryFn: courseApi.getFeaturedCourses,
  });

  const {
    data: newData,
    isLoading: isNewLoading,
    error: newError,
  } = useQuery({
    queryKey: ["courses", "new"],
    queryFn: courseApi.getNewCourses,
  });

  useEffect(() => {
    if (featuredData?.data.courses) {
      setFeaturedCourses(featuredData.data.courses);
    }
  }, [featuredData, setFeaturedCourses]);

  useEffect(() => {
    if (newData?.data.courses) {
      setNewCourses(newData.data.courses);
    }
  }, [newData, setNewCourses]);

  return {
    featuredCourses,
    newCourses,
    isFeaturedLoading,
    isNewLoading,
    featuredError,
    newError,
  };
};

// Hook cho các chức năng cần auth (private)
export const useAuthCourses = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  // Fetch all courses (cần auth)
  const {
    data: courses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: courseApi.getAllCourses,
    enabled: !!token, // Chỉ fetch khi có token
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      courseApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: courseApi.deleteCourse,
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

// Hook cho chi tiết khóa học (public)
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['courses', courseId],
    queryFn: () => courseApi.getCourseById(courseId),
  });
};