"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { quizApi } from "@/api/quiz";
import { Quiz } from "@/api/quiz";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { CreateQuizModal } from "@/components/admin/modals/CreateQuizModal";
import { UpdateQuizModal } from "@/components/admin/modals/UpdateQuizModal";

interface QuizzesResponse {
  quizzes: Quiz[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const fetchQuizzes = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await quizApi.getAllQuizzes({ page, limit: 10 });
      const data = response.data as QuizzesResponse;
      setQuizzes(data.quizzes);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setError(err instanceof Error ? err : new Error("Lỗi không xác định"));
      toast.error("Không thể tải danh sách bài kiểm tra");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(currentPage);
  }, [currentPage]);

  const handleDelete = async (quizId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài kiểm tra này?")) {
      return;
    }

    try {
      await quizApi.deleteQuiz(quizId);
      toast.success("Xóa bài kiểm tra thành công");
      fetchQuizzes(currentPage);
    } catch (error: any) {
      console.error("Error deleting quiz:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể xóa bài kiểm tra";
      toast.error(errorMessage);
    }
  };

  const handleUpdate = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsUpdateModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Số câu hỏi</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Điểm đạt</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[50px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Đã xảy ra lỗi</h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý bài kiểm tra</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bài kiểm tra
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Số câu hỏi</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Điểm đạt</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có bài kiểm tra nào
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => (
                <TableRow key={quiz._id}>
                  <TableCell>{quiz._id}</TableCell>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.questions.length}</TableCell>
                  <TableCell>{quiz.timeLimit} giây</TableCell>
                  <TableCell>{quiz.passingScore}%</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdate(quiz)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(quiz._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <CreateQuizModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchQuizzes(currentPage)}
      />

      {selectedQuiz && (
        <UpdateQuizModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedQuiz(null);
          }}
          onSuccess={() => fetchQuizzes(currentPage)}
          quiz={selectedQuiz}
        />
      )}
    </div>
  );
}
