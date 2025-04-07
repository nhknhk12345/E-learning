import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface QuizOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  _id: string;
  content: string;
  type: "single_choice" | "multiple_choice" | "true_false";
  options: QuizOption[];
  explanation: string;
  points: number;
  quizId: string;
}

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: Record<string, string[]>;
  isSubmitted: boolean;
  score: number;
  totalPoints: number;
  timeLimit: number;
  timeRemaining: number;
  passingScore: number;
  isCompleted: boolean;
  setQuestions: (questions: QuizQuestion[], timeLimit: number) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswers: (questionId: string, answerIds: string[]) => void;
  setScore: (score: number) => void;
  setPassingScore: (score: number) => void;
  setIsCompleted: (completed: boolean) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  setTimeRemaining: (time: number) => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      questions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      isSubmitted: false,
      score: 0,
      totalPoints: 0,
      timeLimit: 600, // Default 10 minutes
      timeRemaining: 600, // Default 10 minutes
      passingScore: 0,
      isCompleted: false,

      setQuestions: (questions, timeLimit) => {
        const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
        const newTimeLimit = timeLimit || 600; // Default to 10 minutes if no timeLimit provided
        set((state) => ({
          ...state,
          questions,
          totalPoints,
          timeLimit: newTimeLimit,
          timeRemaining: newTimeLimit
        }));
      },

      setCurrentQuestionIndex: (index) => {
        set((state) => ({ ...state, currentQuestionIndex: index }));
      },

      setUserAnswers: (questionId, answerIds) => {
        set((state) => ({
          ...state,
          userAnswers: {
            ...state.userAnswers,
            [questionId]: answerIds,
          },
        }));
      },

      setScore: (score) => {
        set((state) => ({ ...state, score }));
      },

      setPassingScore: (score) => {
        set((state) => ({ ...state, passingScore: score }));
      },

      setIsCompleted: (completed) => {
        set((state) => ({ ...state, isCompleted: completed }));
      },

      submitQuiz: () => {
        const { questions, userAnswers } = get();
        let score = 0;

        questions.forEach((question) => {
          const userAnswer = userAnswers[question._id] || [];
          const correctAnswers = question.options
            .filter((opt) => opt.isCorrect)
            .map((opt) => opt.id);

          if (question.type === "single_choice" || question.type === "true_false") {
            if (userAnswer[0] === correctAnswers[0]) {
              score += question.points;
            }
          } else if (question.type === "multiple_choice") {
            const isCorrect =
              userAnswer.length === correctAnswers.length &&
              userAnswer.every((answer) => correctAnswers.includes(answer));
            if (isCorrect) {
              score += question.points;
            }
          }
        });

        set((state) => ({ 
          ...state, 
          score, 
          isSubmitted: true,
          isCompleted: true,
          timeRemaining: 0
        }));
      },

      resetQuiz: () => {
        set({
          questions: [],
          currentQuestionIndex: 0,
          userAnswers: {},
          isSubmitted: false,
          score: 0,
          totalPoints: 0,
          timeLimit: 600,
          timeRemaining: 600,
          passingScore: 0,
          isCompleted: false,
        });
      },

      setTimeRemaining: (time: number) => {
        set((state) => ({
          ...state,
          timeRemaining: Math.max(0, time),
          isCompleted: time <= 0
        }));
      },
    }),
    {
      name: "quiz-storage",
    }
  )
); 