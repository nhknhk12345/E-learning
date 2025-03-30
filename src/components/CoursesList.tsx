'use client';

import { useEffect } from 'react';
import { useCourses } from '@/hooks/useCourses';
import { useCoursesStore, useSyncCoursesStore } from '@/store/useCoursesStore';
import { useAuth } from '@/store/useAuthStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search } from 'lucide-react';

export default function CoursesList() {
  const { user } = useAuth();
  const { courses, isLoading, error, deleteCourse } = useCourses();
  const { syncCourses } = useSyncCoursesStore();
  const { filterCourses, setSelectedCourse } = useCoursesStore();
  
  // Sync React Query data with Zustand store
  useEffect(() => {
    if (courses) {
      syncCourses(courses);
    }
  }, [courses, syncCourses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading courses: {error.message}</div>
      </div>
    );
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId);
      } catch (error) {
        console.error('Failed to delete course:', error);
      }
    }
  };

  const filteredCourses = filterCourses('');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8"
            // onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="relative aspect-video w-full mb-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="object-cover rounded-md w-full h-full"
                />
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription className="flex items-center justify-between">
                <span>By {course.instructor.name}</span>
                <span>{course.totalLessons} lessons</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{course.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto">
              <Button
                variant="default"
                onClick={() => setSelectedCourse(course)}
              >
                View Details
              </Button>
              {user?.role === 'admin' && (
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteCourse(course.id)}
                >
                  Delete
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}