"use client";

import { useParams } from "next/navigation";
import { useCourse } from "@/hooks/useCourses";
import { usePurchaseCourse } from "@/hooks/usePurchaseCourse";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Play,
  Star,
  BookOpen,
  Clock,
  Users,
  Coins,
  Loader2,
} from "lucide-react";
import { CoinPrice } from "@/components/ui/coin-price";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/store/useAuthStore";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

const levelLabels = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
} as const;

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user } = useAuth();
  const { course, isLoading } = useCourse(courseId);
  const { mutate: purchaseCourse, isPending } = usePurchaseCourse();
  const isBought = user?.boughtCourses?.includes(courseId);

  const handlePurchase = () => {
    if (!course) return;

    purchaseCourse(courseId, {
      onSuccess: () => {
        toast.success("Mua khóa học thành công!");
      },
      onError: (error: Error) => {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message || "Có lỗi xảy ra khi mua khóa học"
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Khóa học không tồn tại</h1>
          <Button asChild className="mt-4">
            <Link href="/courses">Quay lại danh sách khóa học</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="font-normal">
                {levelLabels[course.level]}
              </Badge>
              {course.averageRating > 0 && (
                <Badge variant="secondary" className="font-normal">
                  <Star className="h-3 w-3 mr-1 fill-primary" />
                  {course.averageRating.toFixed(1)}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground mb-6">{course.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Bài học</p>
                  <p className="font-medium">{course.lessons?.length || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Học viên</p>
                  <p className="font-medium">{course.enrolledStudents}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Giá</p>
                  <div className="font-medium">
                    <CoinPrice price={course.price} />
                  </div>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Nội dung khóa học</h2>
              <div className="space-y-4">
                {course.lessons?.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">{index + 1}</span>
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {lesson.description}
                        </p>
                      </div>
                    </div>
                    {isBought ? (
                      <Button variant="ghost" size="icon" asChild>
                        <Link
                          href={`/courses/${course._id}/learn/${lesson._id}`}
                        >
                          <Play className="h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" disabled>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="border rounded-lg p-6 space-y-6">
              {isBought ? (
                <Button asChild className="w-full">
                  <Link href={`/learn/${course._id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Học ngay
                  </Link>
                </Button>
              ) : user ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">Giá khóa học</span>
                      <CoinPrice price={course.price} className="text-lg" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mua một lần, học trọn đời
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handlePurchase}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Mua khóa học"
                    )}
                  </Button>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.lessons.length} bài học</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolledStudents} học viên</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <CoinPrice price={course.price} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">Giá khóa học</span>
                      <CoinPrice price={course.price} className="text-lg" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mua một lần, học trọn đời
                    </p>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/auth/login">Đăng nhập để mua khóa học</Link>
                  </Button>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.lessons.length} bài học</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolledStudents} học viên</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <CoinPrice price={course.price} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
