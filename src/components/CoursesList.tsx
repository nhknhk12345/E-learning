"use client";

import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { useCourseStore } from "@/store/useCourseStore";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Course } from "@/types/course";

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

export function CoursesList() {
  const { courses, filters, setFilters, isLoading, error } = useCourseStore();

  // Filter & Sort Logic
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses];

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by level
    if (filters.level !== "all") {
      result = result.filter((course) => course.level === filters.level);
    }

    // Filter by price range
    if (filters.priceRange) {
      result = result.filter(
        (course) =>
          course.price >= filters.priceRange.min &&
          course.price <= filters.priceRange.max
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [courses, filters]);

  // Pagination
  const pageSize = 12;
  const startIndex = (filters.page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCourses = filteredAndSortedCourses.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredAndSortedCourses.length / pageSize);

  // Handlers
  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Có lỗi xảy ra khi tải danh sách khóa học
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm khóa học..."
          className="pl-10"
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array(6)
            .fill(0)
            .map((_, i) => <CourseCardSkeleton key={i} />)
        ) : paginatedCourses.length > 0 ? (
          // Course list
          paginatedCourses.map((course: Course) => (
            <CourseCard key={course._id} course={course} />
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-8 text-muted-foreground">
            Không tìm thấy khóa học nào
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
