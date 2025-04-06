"use client";

import { Course } from "@/types/course";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "./ui/button";
import { BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { CoinPrice } from "./ui/coin-price";

const levelColors = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
} as const;

const levelLabels = {
  beginner: "Cơ bản",
  intermediate: "Trung cấp",
  advanced: "Nâng cao",
} as const;

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-2">
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

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
          {course.description}
        </p>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{course.enrolledStudents} học viên</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto border-t">
        <CoinPrice price={course.price} className="text-lg" />
        <Button variant="secondary" size="sm" asChild>
          <Link href={`/courses/${course._id}`}>Xem chi tiết</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
