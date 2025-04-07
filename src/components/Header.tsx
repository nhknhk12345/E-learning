"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAuth as useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, LayoutDashboard, Search, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    role: ["admin", "user"],
  },
  {
    title: "Khóa học",
    icon: Book,
    href: "/courses",
    role: ["admin", "user"],
  },
];

export default function Header() {
  const { user, isLoadingUser } = useAuthStore();
  const { logout, isLogoutLoading } = useAuth();
  const pathname = usePathname();

  const filteredMenuItems = menuItems.filter((item) =>
    item.role.includes(user?.role || "user")
  );

  const renderAuthSection = () => {
    if (isLoadingUser) {
      return (
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              {user.balance?.toLocaleString("vi-VN")}đ
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href="/payment/deposit">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl || ""} alt={user.username} />
                  <AvatarFallback>
                    {user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Hồ sơ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Cài đặt</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => logout()}
                disabled={isLogoutLoading}
              >
                {isLogoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/auth/login">Đăng nhập</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/register">Đăng ký</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">E-Learning Platform</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {filteredMenuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("gap-2", pathname === item.href && "bg-muted")}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="relative">
            <Search className="h-5 w-5" />
          </Button>

          <ModeToggle />

          {renderAuthSection()}
        </div>
      </div>
    </header>
  );
}
