import { lessonApi } from '@/api/lessons';
import { useQuery } from "@tanstack/react-query";

export const useLesson = (lessonId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => lessonApi.getLesson(lessonId),
    enabled: !!lessonId,
  });

  return {
    lesson: data?.data,
    isLoading,
    error,
  };
}; 