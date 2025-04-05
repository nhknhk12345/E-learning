"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Book, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/store/useAuthStore";

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    role: ["admin", "user"],
  },
  {
    title: "Khóa học",
    icon: Book,
    href: "/courses",
    role: ["admin", "user"],
  },
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/settings",
    role: ["admin", "user"],
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter((item) =>
    item.role.includes(user?.role || "user")
  );

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
