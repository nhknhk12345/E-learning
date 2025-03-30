'use client';

import { useEffect } from 'react';
import CoursesList from '@/components/CoursesList';
import { useAuth } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function CoursesPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  // Protect the route
  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!user || !token) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Courses</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Explore our wide range of courses designed to help you learn and grow
          </p>
        </div>
        {user.role === 'admin' && (
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Course
          </Button>
        )}
      </div>

      <div className="space-y-8">
        <CoursesList />
      </div>
    </main>
  );
}