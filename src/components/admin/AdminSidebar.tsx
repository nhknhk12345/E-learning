"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  HelpCircle,
  ListChecks,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Tổng quan",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Khóa học",
    href: "/admin/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Bài học",
    href: "/admin/dashboard/lessons",
    icon: GraduationCap,
  },
  {
    title: "Bài giảng",
    href: "/admin/dashboard/lectures",
    icon: FileText,
  },
  {
    title: "Bài kiểm tra",
    href: "/admin/dashboard/quizzes",
    icon: HelpCircle,
  },
  {
    title: "Quản lý câu hỏi",
    href: "/admin/dashboard/quiz-questions",
    icon: ListChecks,
  },
  {
    title: "Người dùng",
    href: "/admin/dashboard/users",
    icon: Users,
  },
  {
    title: "Cài đặt",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className={cn("w-64 border-r bg-background", className)}>
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      </div>
      <div className="space-y-1 p-2">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => router.push(item.href)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
