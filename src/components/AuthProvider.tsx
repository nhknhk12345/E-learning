"use client"

import { useAuth } from '@/hooks/useAuth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Khi component mount, useAuth hook sẽ tự động fetch user data nếu có token
  const { isLoadingUser } = useAuth()

  if (isLoadingUser) {
    // Có thể thêm loading spinner ở đây nếu cần
    return null
  }

  return <>{children}</>
}