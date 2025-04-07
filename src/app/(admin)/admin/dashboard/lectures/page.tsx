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
import { lectureApi } from "@/api/lectures";
import { Lecture } from "@/types/lecture";
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
import { CreateLectureModal } from "@/components/admin/modals/CreateLectureModal";
import { UpdateLectureModal } from "@/components/admin/modals/UpdateLectureModal";

interface LecturesResponse {
  lectures: Lecture[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

  const fetchLectures = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await lectureApi.getAllLectures({ page, limit: 10 });
      const data = response.data as LecturesResponse;
      setLectures(data.lectures);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      console.error("Error fetching lectures:", err);
      setError(err instanceof Error ? err : new Error("Lỗi không xác định"));
      toast.error("Không thể tải danh sách bài giảng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures(currentPage);
  }, [currentPage]);

  const handleDelete = async (lectureId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài giảng này?")) {
      return;
    }

    try {
      await lectureApi.deleteLecture(lectureId);
      toast.success("Xóa bài giảng thành công");
      fetchLectures(currentPage);
    } catch (error: any) {
      console.error("Error deleting lecture:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể xóa bài giảng";
      toast.error(errorMessage);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdate = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setIsUpdateModalOpen(true);
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
                <TableHead>Tên bài giảng</TableHead>
                <TableHead>Bài học</TableHead>
                <TableHead>Thứ tự</TableHead>
                <TableHead>Thời lượng</TableHead>
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
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
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
        <h1 className="text-3xl font-bold">Quản lý bài giảng</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm bài giảng
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên bài giảng</TableHead>
              <TableHead>Bài học</TableHead>
              <TableHead>Thứ tự</TableHead>
              <TableHead>Thời lượng</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lectures.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Không có bài giảng nào
                </TableCell>
              </TableRow>
            ) : (
              lectures.map((lecture) => (
                <TableRow key={lecture._id}>
                  <TableCell>{lecture._id}</TableCell>
                  <TableCell>{lecture.title}</TableCell>
                  <TableCell>{lecture.lessonId}</TableCell>
                  <TableCell>{lecture.order}</TableCell>
                  <TableCell>{lecture.content?.duration || 0} phút</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdate(lecture)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(lecture._id)}
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

      <CreateLectureModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchLectures(currentPage)}
      />

      {selectedLecture && (
        <UpdateLectureModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedLecture(null);
          }}
          onSuccess={() => fetchLectures(currentPage)}
          lecture={selectedLecture}
        />
      )}
    </div>
  );
}
