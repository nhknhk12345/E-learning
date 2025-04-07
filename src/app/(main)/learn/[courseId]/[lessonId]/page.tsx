"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCourse } from "@/hooks/useCourses";
import { useLesson } from "@/hooks/useLesson";
import { useLecture } from "@/hooks/useLecture";
import { useQuiz } from "@/hooks/useQuiz";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  ChevronRight as ChevronRightIcon,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useQuizStore } from "@/store/useQuizStore";

export default function LearnLessonPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const lectureId = searchParams.get("lecture");
  const { user } = useAuth();
  const { course, isLoading: isLoadingCourse } = useCourse(courseId);
  const { lesson, isLoading: isLoadingLesson } = useLesson(lessonId);
  const { lecture, isLoading: isLoadingLecture } = useLecture(lectureId || "");
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const { data: quizData, isLoading: isLoadingQuiz } = useQuiz(
    selectedQuizId || ""
  );

  const isBought = user?.boughtCourses?.includes(courseId);

  useEffect(() => {
    if (!isLoadingCourse && !isBought) {
      toast.error("Bạn chưa mua khóa học này");
      router.push("/");
    }
  }, [isLoadingCourse, isBought, router]);

  useEffect(() => {
    if (lecture?.endQuiz?.isEnabled && lecture.endQuiz.quizId) {
      setSelectedQuizId(lecture.endQuiz.quizId);
    }
  }, [lecture]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} phút`;
  };

  const handleStartQuiz = () => {
    if (currentLecture?.endQuiz?.quizId) {
      setSelectedQuizId(currentLecture.endQuiz.quizId);
      setIsQuizModalOpen(true);
    }
  };

  const handleBeginQuiz = () => {
    if (!selectedQuizId || !quizData) {
      toast.error("Không thể tải bài kiểm tra. Vui lòng thử lại sau.");
      return;
    }

    // Lưu timeLimit vào store trước khi chuyển trang
    useQuizStore.setState((state) => ({
      ...state,
      timeLimit: quizData.timeLimit,
      timeRemaining: quizData.timeLimit,
      passingScore: quizData.passingScore,
    }));
    setIsQuizModalOpen(false);
    router.push(`/quiz/${selectedQuizId}`);
  };

  if (isLoadingCourse || isLoadingLesson || (lectureId && isLoadingLecture)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
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

  if (!course || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bài học không tồn tại</h1>
          <Button asChild className="mt-4">
            <Link href={`/learn/${courseId}`}>Quay lại khóa học</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentLessonIndex = course.lessons.findIndex(
    (l) => l._id === lesson._id
  );
  const prevLesson = course.lessons[currentLessonIndex - 1];
  const nextLesson = course.lessons[currentLessonIndex + 1];

  const currentLecture = lecture || lesson.lectures?.[0];

  const currentLectureIndex = lesson.lectures?.findIndex(
    (l) => l._id === currentLecture?._id
  );
  const prevLecture =
    currentLectureIndex > 0 ? lesson.lectures?.[currentLectureIndex - 1] : null;
  const nextLecture =
    currentLectureIndex < (lesson.lectures?.length || 0) - 1
      ? lesson.lectures?.[currentLectureIndex + 1]
      : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href={`/learn/${courseId}`} className="hover:text-foreground">
          {course?.title}
        </Link>
        <ChevronRightIcon className="h-4 w-4" />
        <span className="hover:text-foreground">{lesson?.title}</span>
        {currentLecture && (
          <>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-foreground">{currentLecture.title}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {currentLecture?.content?.videoUrl && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={currentLecture.content.videoUrl}
                controls
                className="w-full h-full"
              />
            </div>
          )}

          <div className="mt-6">
            <h1 className="text-2xl font-bold mb-2">{currentLecture?.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {currentLecture?.content?.videoUrl && (
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>Video bài giảng</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {formatDuration(currentLecture?.content?.duration || 0)}
                </span>
              </div>
              {currentLecture?.endQuiz?.isEnabled && (
                <div className="flex items-center gap-1">
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Có bài kiểm tra</span>
                </div>
              )}
            </div>
            <div className="prose max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {currentLecture?.content?.text}
              </p>
            </div>

            {currentLecture?.endQuiz?.isEnabled && (
              <div className="mt-8 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">
                      Bài kiểm tra cuối bài
                    </h3>
                  </div>
                  <Button onClick={handleStartQuiz}>
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Làm bài kiểm tra
                  </Button>
                </div>
                {currentLecture.endQuiz.requiredToComplete && (
                  <p className="text-sm text-muted-foreground">
                    Bạn cần đạt ít nhất {currentLecture.endQuiz.minScore}% để
                    hoàn thành bài học này
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            {/* Điều hướng giữa các lecture trong cùng lesson */}
            <div className="flex gap-4">
              {prevLecture && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/learn/${courseId}/${lessonId}?lecture=${prevLecture._id}`}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Bài trước
                  </Link>
                </Button>
              )}
              {nextLecture && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/learn/${courseId}/${lessonId}?lecture=${nextLecture._id}`}
                    className="flex items-center gap-2"
                  >
                    Bài tiếp theo
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Điều hướng giữa các lesson */}
            <div className="flex gap-4">
              {prevLesson && !prevLecture && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/learn/${courseId}/${prevLesson._id}`}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Bài học trước
                  </Link>
                </Button>
              )}
              {nextLesson && !nextLecture && (
                <Button variant="outline" asChild>
                  <Link
                    href={`/learn/${courseId}/${nextLesson._id}`}
                    className="flex items-center gap-2"
                  >
                    Bài học tiếp theo
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Nội dung bài học</h2>
              <span className="text-xs text-muted-foreground">
                {lesson.lectures?.length || 0} bài giảng
              </span>
            </div>
            <div className="space-y-2">
              {lesson.lectures?.map((lecture) => (
                <Link
                  key={lecture._id}
                  href={`/learn/${courseId}/${lessonId}?lecture=${lecture._id}`}
                  className={`block p-3 rounded-lg ${
                    lecture._id === currentLecture?._id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted transition-colors"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-medium">{lecture.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {lecture.content?.videoUrl && (
                          <div className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            <span>Video</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {formatDuration(lecture.content?.duration || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isQuizModalOpen} onOpenChange={setIsQuizModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thông tin bài kiểm tra</DialogTitle>
            <DialogDescription asChild>
              <div className="text-muted-foreground text-sm">
                {isLoadingQuiz ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium mb-2">Bài kiểm tra</div>
                      <div className="text-sm text-muted-foreground">
                        Kiểm tra kiến thức của bạn sau khi học bài giảng này
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Thời gian: {formatDuration(quizData?.timeLimit || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Điểm đạt: {quizData?.passingScore}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                        <span>Số câu hỏi: {quizData?.questions.length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuizModalOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleBeginQuiz}
              disabled={isLoadingQuiz || !selectedQuizId}
            >
              {isLoadingQuiz ? "Đang tải..." : "Bắt đầu làm bài"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
