import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import { useQuizStore } from "@/store/useQuizStore";

export const useQuiz = (quizId: string) => {
  const { setQuestions, setTimeRemaining, setPassingScore } = useQuizStore();

  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/quiz-questions/quiz/${quizId}`);
      const quizQuestions = response.data.data.questions;
      const timeLimit = quizQuestions[0]?.quizId?.timeLimit || 600;
      const passingScore = quizQuestions[0]?.quizId?.passingScore || 0;

      // Cập nhật store
      setQuestions(quizQuestions, timeLimit);
      setTimeRemaining(timeLimit);
      setPassingScore(passingScore);

      return {
        questions: quizQuestions,
        timeLimit,
        passingScore
      };
    },
    enabled: !!quizId && quizId !== "",
  });
}; 