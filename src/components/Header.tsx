'use client';

import Link from 'next/link';
import { useAuth, useAuthActions } from '@/store/useAuthStore';
import { authApi } from '@/api/authentication';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { GraduationCap, BookOpen, User, LogOut, Plus } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
export default function Header() {
  const { user } = useAuth();
  const { clearAuth } = useAuthActions();
  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearAuth();
    } catch (error) {
      console.error('Logout failed:', error);
      // Ngay cả khi API call thất bại, vẫn clear auth state để đăng xuất người dùng
      clearAuth();
    }
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="text-xl font-bold">E-Learning</span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/courses" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Courses
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {user?.role === 'admin' && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Admin
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-4 w-[200px]">
                        <Link href="/admin/courses" className="block">
                          Manage Courses
                        </Link>
                        <Link href="/admin/users" className="block">
                          Manage Users
                        </Link>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                    <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.username}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">{user.balance.toLocaleString()}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}