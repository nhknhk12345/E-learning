"use client";

import { useParams, useRouter } from "next/navigation";
import { useCourse } from "@/hooks/useCourses";
import { useLesson } from "@/hooks/useLesson";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Play, Clock, FileText, Video } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { user } = useAuth();
  const { course, isLoading } = useCourse(courseId);
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const { lesson: selectedLesson, isLoading: isLoadingLesson } = useLesson(
    selectedLessonId || ""
  );

  const isBought = user?.boughtCourses?.includes(courseId);

  useEffect(() => {
    if (!isLoading && !isBought) {
      toast.error("Bạn chưa mua khóa học này");
      router.push("/");
    }
  }, [isLoading, isBought, router]);

  const handleAccordionChange = (values: string[]) => {
    setExpandedLessons(values);
    // Nếu có lesson mới được mở, fetch dữ liệu chi tiết
    const newlyExpandedLesson = values.find(
      (value) => !expandedLessons.includes(value)
    );
    if (newlyExpandedLesson) {
      setSelectedLessonId(newlyExpandedLesson);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            {!isBought && (
              <Button asChild>
                <Link href={`/courses/${courseId}`}>Mua khóa học</Link>
              </Button>
            )}
          </div>

          <Accordion
            type="multiple"
            value={expandedLessons}
            onValueChange={handleAccordionChange}
            className="space-y-4"
          >
            {course.lessons?.map((lesson, lessonIndex) => {
              const isExpanded = expandedLessons.includes(lesson._id);
              const isCurrentLesson = selectedLessonId === lesson._id;
              const lessonDetails =
                isExpanded && isCurrentLesson ? selectedLesson : null;

              return (
                <AccordionItem
                  key={lesson._id}
                  value={lesson._id}
                  className="border rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-4 w-full">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-left">
                          Bài {lessonIndex + 1}: {lesson.title}
                        </h3>
                        <p className="text-muted-foreground text-left mt-1">
                          {lesson.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          {isExpanded && lessonDetails ? (
                            <>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {formatDuration(
                                    lessonDetails.lectures?.reduce(
                                      (total: number, lecture) =>
                                        total +
                                        (lecture.content?.duration || 0),
                                      0
                                    ) || 0
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                <span>
                                  {lessonDetails.lectures?.length || 0} bài
                                  giảng
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>
                                {lesson.lectures?.length || 0} bài giảng
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <div className="space-y-4 pl-4">
                      {isLoadingLesson && isCurrentLesson ? (
                        <div className="space-y-4">
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      ) : (
                        lessonDetails?.lectures?.map(
                          (lecture, lectureIndex) => (
                            <div
                              key={lecture._id}
                              className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-start gap-4">
                                <div className="flex-1">
                                  <h4 className="font-medium">
                                    {lessonIndex + 1}.{lectureIndex + 1}{" "}
                                    {lecture.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {lecture.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                    {lecture.content?.videoUrl && (
                                      <div className="flex items-center gap-1">
                                        <Video className="h-4 w-4" />
                                        <span>Video</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {formatDuration(
                                          lecture.content?.duration || 0
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {isBought && (
                                <Button size="sm" variant="outline" asChild>
                                  <Link
                                    href={`/learn/${courseId}/${lesson._id}?lecture=${lecture._id}`}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Học ngay
                                  </Link>
                                </Button>
                              )}
                            </div>
                          )
                        )
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div>
          <div className="border rounded-lg p-6 space-y-4 sticky top-24">
            <h2 className="text-xl font-semibold">Thông tin khóa học</h2>
            <div className="space-y-2">
              <p className="text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tổng số bài học: {course.lessons?.length || 0}
              </p>
            </div>
            <Button className="w-full" asChild>
              <Link href={`/courses/${courseId}`}>Xem trang khóa học</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
