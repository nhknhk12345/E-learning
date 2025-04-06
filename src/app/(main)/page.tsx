"use client";

import HeroCarousel from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, GraduationCap, Clock, HeadphonesIcon } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicCourses } from "@/hooks/useCourses";

function CourseCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[180px] w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default function Home() {
  const {
    featuredCourses,
    newCourses,
    isFeaturedLoading,
    isNewLoading,
    featuredError,
    newError,
  } = usePublicCourses();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Khóa học nổi bật</h2>
          {featuredError ? (
            <div className="text-center text-red-500">
              Có lỗi xảy ra khi tải khóa học nổi bật
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isFeaturedLoading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => <CourseCardSkeleton key={i} />)
                : featuredCourses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
            </div>
          )}
        </div>
      </section>

      {/* New Courses Section */}
      <section className="py-16 px-4 md:px-8 bg-muted/30">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Khóa học mới</h2>
            <Button variant="outline" asChild>
              <Link href="/courses">
                Xem tất cả
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {newError ? (
            <div className="text-center text-red-500">
              Có lỗi xảy ra khi tải khóa học mới
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isNewLoading
                ? Array(4)
                    .fill(0)
                    .map((_, i) => <CourseCardSkeleton key={i} />)
                : newCourses.map((course) => (
                    <CourseCard key={course._id} course={course} />
                  ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 md:px-8 bg-muted/50">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Chất lượng hàng đầu
              </h3>
              <p className="text-muted-foreground">
                Nội dung được biên soạn kỹ lưỡng bởi các chuyên gia
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Học mọi lúc mọi nơi
              </h3>
              <p className="text-muted-foreground">
                Truy cập khóa học từ mọi thiết bị, mọi thời điểm
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <HeadphonesIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-muted-foreground">
                Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Đăng ký ngay hôm nay để trải nghiệm các khóa học chất lượng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/courses">
                Xem khóa học
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/register">Đăng ký ngay</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
