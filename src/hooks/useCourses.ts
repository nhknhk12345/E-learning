import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/api/courses';
import { useCourseStore } from "@/store/useCourseStore";
import { useEffect } from 'react';
import type { Course, ApiResponse, CoursesResponse, FeaturedCoursesResponse, NewCoursesResponse } from '@/types/course';

// Hook cho trang chủ
export function useInitializeHome() {
  const {
    setFeaturedCourses,
    setNewCourses,
    setLoading,
    setError
  } = useCourseStore();

  const featuredCoursesQuery = useQuery<ApiResponse<FeaturedCoursesResponse>>({
    queryKey: ['courses', 'featured'],
    queryFn: courseApi.getFeaturedCourses,
  });

  const newCoursesQuery = useQuery<ApiResponse<NewCoursesResponse>>({
    queryKey: ['courses', 'new'],
    queryFn: courseApi.getNewCourses,
  });

  useEffect(() => {
    const isLoading = featuredCoursesQuery.isLoading || newCoursesQuery.isLoading;
    setLoading(isLoading);
  }, [featuredCoursesQuery.isLoading, newCoursesQuery.isLoading, setLoading]);

  useEffect(() => {
    const error = featuredCoursesQuery.error || newCoursesQuery.error;
    setError(error);
  }, [featuredCoursesQuery.error, newCoursesQuery.error, setError]);

  useEffect(() => {
    if (featuredCoursesQuery.data) {
      setFeaturedCourses(featuredCoursesQuery.data.data.courses);
    }
  }, [featuredCoursesQuery.data, setFeaturedCourses]);

  useEffect(() => {
    if (newCoursesQuery.data) {
      setNewCourses(newCoursesQuery.data.data.courses);
    }
  }, [newCoursesQuery.data, setNewCourses]);
}

// Hook cho trang danh sách khóa học
export function useInitializeCourses() {
  const {
    setCourses,
    setLoading,
    setError
  } = useCourseStore();

  // Query cho all courses (public)
  const coursesQuery = useQuery<ApiResponse<CoursesResponse>>({
    queryKey: ['courses', 'all'],
    queryFn: () => courseApi.getAllCourses(),
  });

  // Cập nhật loading state
  useEffect(() => {
    setLoading(coursesQuery.isLoading);
  }, [coursesQuery.isLoading, setLoading]);

  // Cập nhật error state
  useEffect(() => {
    setError(coursesQuery.error);
  }, [coursesQuery.error, setError]);

  // Cập nhật state khi có data mới
  useEffect(() => {
    if (coursesQuery.data) {
      setCourses(coursesQuery.data.data.courses);
    }
  }, [coursesQuery.data, setCourses]);
}

// Hook chính cho tất cả chức năng liên quan đến courses
export const useCourses = () => {
  const { data, isLoading, error } = useQuery<ApiResponse<CoursesResponse>>({
    queryKey: ["courses"],
    queryFn: () => courseApi.getAllCourses(),
  });

  return {
    courses: data?.data.courses || [],
    meta: data?.data.meta,
    isLoading,
    error,
  };
};

// Hook cho trang danh sách khóa học
export const useCoursesList = (params: {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  category?: string;
}) => {
  const { data, isLoading, error } = useQuery<ApiResponse<CoursesResponse>>({
    queryKey: ["courses", params],
    queryFn: () => courseApi.getAllCourses(params),
  });

  return {
    courses: data?.data.data.courses || [],
    meta: data?.data.data.meta,
    isLoading,
    error,
  };
};

// Hook cho trang chi tiết khóa học
export const useCourse = (courseId: string) => {
  const { data, isLoading, error } = useQuery<ApiResponse<Course>>({
    queryKey: ["course", courseId],
    queryFn: () => courseApi.getCourseById(courseId),
    enabled: !!courseId,
  });

  return {
    course: data?.data,
    isLoading,
    error,
  };
};