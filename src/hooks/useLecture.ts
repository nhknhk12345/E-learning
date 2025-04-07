import { lectureApi } from '@/api/lectures';
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, Lecture } from "@/types/course";

export const useLecture = (lectureId: string) => {
  const { data, isLoading, error } = useQuery<ApiResponse<Lecture>, Error>({
    queryKey: ["lecture", lectureId],
    queryFn: () => lectureApi.getLecture(lectureId),
    enabled: !!lectureId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return {
    lecture: data?.data,
    isLoading,
    error,
  };
}; 