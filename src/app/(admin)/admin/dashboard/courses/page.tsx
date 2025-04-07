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
import { courseApi } from "@/api/courses";
import { Course } from "@/types/course";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateCourseModal } from "@/components/admin/modals/CreateCourseModal";
import { UpdateCourseModal } from "@/components/admin/modals/UpdateCourseModal";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await courseApi.getAllCourses();
      setCourses(response.data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err instanceof Error ? err : new Error("Lỗi không xác định"));
      toast.error("Không thể tải danh sách khóa học");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUpdate = (course: Course) => {
    setSelectedCourse(course);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      return;
    }

    try {
      await courseApi.deleteCourse(courseId);
      toast.success("Xóa khóa học thành công");
      fetchCourses();
    } catch (error: any) {
      console.error("Error deleting course:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể xóa khóa học";
      toast.error(errorMessage);
    }
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
                <TableHead>Tên khóa học</TableHead>
                <TableHead>Cấp độ</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Học viên</TableHead>
                <TableHead>Đánh giá</TableHead>
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
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
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
        <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm khóa học
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên khóa học</TableHead>
              <TableHead>Cấp độ</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Học viên</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course._id}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.level}</TableCell>
                <TableCell>{course.price}</TableCell>
                <TableCell>{course.enrolledStudents}</TableCell>
                <TableCell>{course.averageRating}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdate(course)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(course._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchCourses}
      />

      {selectedCourse && (
        <UpdateCourseModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedCourse(null);
          }}
          onSuccess={fetchCourses}
          course={selectedCourse}
        />
      )}
    </div>
  );
}
