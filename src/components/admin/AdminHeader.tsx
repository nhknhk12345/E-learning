"use client";

import { useAuth } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useAuth as useAuthHook } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AdminHeader() {
  const { user } = useAuth();
  const { logout } = useAuthHook();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Đăng xuất thất bại");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <span className="font-bold">Admin Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{user?.username}</span>
          <Button variant="ghost" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
