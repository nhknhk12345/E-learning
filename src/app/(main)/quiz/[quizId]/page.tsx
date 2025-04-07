"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuiz } from "@/hooks/useQuiz";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId as string;
  const {
    questions,
    currentQuestionIndex,
    userAnswers,
    score,
    timeRemaining,
    passingScore,
    isCompleted,
    setQuestions,
    setCurrentQuestionIndex,
    setUserAnswers,
    setTimeRemaining,
    submitQuiz,
  } = useQuizStore();

  const { data: quizData, isLoading } = useQuiz(quizId);

  useEffect(() => {
    if (quizData) {
      setQuestions(quizData.questions, quizData.timeLimit);
      setTimeRemaining(quizData.timeLimit);
      useQuizStore.setState((state) => ({
        ...state,
        passingScore: quizData.passingScore,
      }));
    }
  }, [quizData, setQuestions, setTimeRemaining]);

  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted) {
      const timer = setInterval(() => {
        const newTimeRemaining = timeRemaining - 1;
        if (newTimeRemaining <= 0) {
          clearInterval(timer);
          submitQuiz();
          setTimeRemaining(0);
        } else {
          setTimeRemaining(newTimeRemaining);
        }
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [timeRemaining, isCompleted, submitQuiz, setTimeRemaining]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const totalPoints = questions.reduce((total, q) => total + q.points, 0);

  const formatTime = (seconds: number) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "--:--";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy câu hỏi</h1>
            <p className="text-muted-foreground mb-4">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
            </p>
            <Button onClick={() => router.back()}>Quay lại</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (value: string) => {
    if (
      currentQuestion.type === "single_choice" ||
      currentQuestion.type === "true_false"
    ) {
      setUserAnswers(currentQuestion._id, [value]);
    }
  };

  const handleMultipleChoiceChange = (optionId: string, checked: boolean) => {
    const currentAnswers = userAnswers[currentQuestion._id] || [];
    if (checked) {
      setUserAnswers(currentQuestion._id, [...currentAnswers, optionId]);
    } else {
      setUserAnswers(
        currentQuestion._id,
        currentAnswers.filter((id) => id !== optionId)
      );
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    submitQuiz();
  };

  if (isCompleted) {
    const percentage = (score / totalPoints) * 100;
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Kết quả bài kiểm tra</h1>
            <div className="mb-8">
              <div className="text-4xl font-bold mb-2">
                {percentage.toFixed(1)}%
              </div>
              <div className="text-muted-foreground">
                {score} / {totalPoints} điểm
              </div>
            </div>
            {percentage >= passingScore ? (
              <div className="text-green-600 mb-4">
                Chúc mừng! Bạn đã hoàn thành bài kiểm tra.
              </div>
            ) : (
              <div className="text-red-600 mb-4">
                Tiếc quá! Bạn chưa đạt điểm yêu cầu ({passingScore}%).
              </div>
            )}
            <Button onClick={() => router.back()}>Quay lại</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              Câu {currentQuestionIndex + 1}/{questions.length}
            </span>
          </div>
        </div>

        <Progress value={progress} className="mb-6" />

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion.content}
          </h2>

          {currentQuestion.type === "single_choice" ||
          currentQuestion.type === "true_false" ? (
            <RadioGroup
              value={userAnswers[currentQuestion._id]?.[0] || ""}
              onValueChange={handleAnswerChange}
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.content}</Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={
                      userAnswers[currentQuestion._id]?.includes(option.id) ||
                      false
                    }
                    onCheckedChange={(checked) =>
                      handleMultipleChoiceChange(option.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={option.id}>{option.content}</Label>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Câu trước
          </Button>
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit}>Nộp bài</Button>
          ) : (
            <Button onClick={handleNext}>
              Câu tiếp
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
