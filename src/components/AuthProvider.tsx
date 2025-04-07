"use client";

import { useAuth } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Chỉ gọi useAuth để trigger việc fetch user data
  useAuth();

  // Render children ngay lập tức, không đợi auth state
  return <>{children}</>;
}
