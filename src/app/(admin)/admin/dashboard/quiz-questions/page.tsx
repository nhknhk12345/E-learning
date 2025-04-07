"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { quizApi } from "@/api/quiz";
import { QuizQuestion } from "@/store/useQuizStore";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { QuizQuestionModal } from "@/components/admin/modals/QuizQuestionModal";
import { toast } from "sonner";

export default function QuizQuestionsPage() {
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<
    QuizQuestion | undefined
  >();

  const {
    data: quizzes,
    isLoading: isLoadingQuizzes,
    refetch: refetchQuizzes,
  } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => quizApi.getAllQuizzes({ page: 1, limit: 50 }),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    console.log("Quizzes data:", quizzes);
  }, [quizzes]);

  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["quiz-questions", selectedQuizId],
    queryFn: () => quizApi.getQuestionsByQuiz(selectedQuizId),
    enabled: !!selectedQuizId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const handleAddQuestion = () => {
    setSelectedQuestion(undefined);
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: QuizQuestion) => {
    setSelectedQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await quizApi.deleteQuestion(questionId);
      toast.success("Xóa câu hỏi thành công");
      refetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      toast.error("Không thể xóa câu hỏi");
    }
  };

  const handleQuestionSuccess = async (question: QuizQuestion) => {
    try {
      if (question._id) {
        await quizApi.updateQuestion(question._id, question);
        toast.success("Cập nhật câu hỏi thành công");
      } else {
        await quizApi.addQuestion(selectedQuizId, question);
        toast.success("Thêm câu hỏi thành công");
      }
      refetchQuestions();
    } catch (error) {
      console.error("Error saving question:", error);
      toast.error("Không thể lưu câu hỏi");
    }
  };

  // Kiểm tra cấu trúc dữ liệu
  const quizList = quizzes?.data?.quizzes || [];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý câu hỏi</h1>
        <div className="flex items-center gap-4">
          <Select
            value={selectedQuizId}
            onValueChange={(value) => {
              setSelectedQuizId(value);
              refetchQuizzes();
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Chọn bài kiểm tra" />
            </SelectTrigger>
            <SelectContent>
              {isLoadingQuizzes ? (
                <SelectItem value="loading" disabled>
                  Đang tải...
                </SelectItem>
              ) : quizList.length > 0 ? (
                quizList.map((quiz) => (
                  <SelectItem key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-quizzes" disabled>
                  Không có bài kiểm tra nào
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button onClick={handleAddQuestion} disabled={!selectedQuizId}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm câu hỏi
          </Button>
        </div>
      </div>

      {isLoadingQuestions ? (
        <div className="text-center text-muted-foreground">
          Đang tải câu hỏi...
        </div>
      ) : selectedQuizId ? (
        <div className="grid gap-4">
          {questionsData?.data?.questions?.length ? (
            questionsData.data.questions.map((question, index) => (
              <Card key={question._id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">
                    Câu {index + 1}: {question.content}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditQuestion(question)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteQuestion(question._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Loại:{" "}
                      {question.type === "single_choice"
                        ? "Chọn một đáp án"
                        : question.type === "multiple_choice"
                        ? "Chọn nhiều đáp án"
                        : "Đúng/Sai"}
                    </p>
                    <div className="space-y-1">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`text-sm ${
                            option.isCorrect ? "text-green-600 font-medium" : ""
                          }`}
                        >
                          {String.fromCharCode(65 + optionIndex)}.{" "}
                          {option.content}
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Giải thích: {question.explanation}
                      </p>
                    )}
                    <p className="text-sm font-medium">
                      Điểm: {question.points}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              Chưa có câu hỏi nào trong bài kiểm tra này
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          Vui lòng chọn bài kiểm tra để xem danh sách câu hỏi
        </div>
      )}

      <QuizQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        onSuccess={handleQuestionSuccess}
        question={selectedQuestion}
        quizId={selectedQuizId}
      />
    </div>
  );
}
