"use client";

import { CoursesList } from "@/components/CoursesList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCourseStore } from "@/store/useCourseStore";
import { useInitializeCourses } from "@/hooks/useCourses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice } from "@/lib/utils";
import { CourseLevel } from "@/types/course";

export default function CoursesPage() {
  useInitializeCourses();

  const { filters, setFilters } = useCourseStore();
  const { level, sortBy, priceRange } = filters;

  const handleLevelChange = (value: string) => {
    setFilters({ ...filters, level: value as CourseLevel | "all", page: 1 });
  };

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sortBy: value, page: 1 });
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setFilters({ ...filters, priceRange: range, page: 1 });
  };

  const sliderValue = [
    typeof priceRange?.min === "number" ? priceRange.min : 0,
    typeof priceRange?.max === "number" ? priceRange.max : 2000,
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Khóa học</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Khám phá các khóa học được thiết kế để giúp bạn học tập và phát
            triển
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <div className="w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Cấp độ</Label>
                <Select value={level} onValueChange={handleLevelChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cấp độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="beginner">Cơ bản</SelectItem>
                    <SelectItem value="intermediate">Trung cấp</SelectItem>
                    <SelectItem value="advanced">Nâng cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Khoảng giá</h3>
                  <span className="text-sm text-muted-foreground">
                    {formatPrice(priceRange?.min || 0)} -{" "}
                    {formatPrice(priceRange?.max || 2000)}
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Slider
                        value={sliderValue}
                        min={0}
                        max={2000}
                        step={100}
                        onValueChange={(value) =>
                          handlePriceRangeChange({
                            min: value[0],
                            max: value[1],
                          })
                        }
                        className="w-full"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {formatPrice(priceRange?.min || 0)} -{" "}
                        {formatPrice(priceRange?.max || 2000)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Sắp xếp theo</Label>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cách sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="price-asc">Giá tăng dần</SelectItem>
                    <SelectItem value="price-desc">Giá giảm dần</SelectItem>
                    <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <CoursesList />
        </div>
      </div>
    </main>
  );
}
