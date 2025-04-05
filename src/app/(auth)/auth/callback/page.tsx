"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { authApi } from "@/api/authentication";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setGoogleAuth } = useAuth();
  const isProcessing = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (isProcessing.current) return;

      try {
        isProcessing.current = true;

        const access_token = searchParams.get("access_token");
        const error = searchParams.get("error");

        if (error) {
          toast.error("Đăng nhập thất bại: " + error);
          router.push("/auth/login");
          return;
        }

        if (!access_token) {
          toast.error("Không nhận được token");
          router.push("/auth/login");
          return;
        }

        localStorage.setItem("access_token", access_token);

        const response = await authApi.getMe();
        const user = response.data;

        setGoogleAuth(user, access_token);

        toast.success("Đăng nhập thành công");
        router.push("/");
      } catch (error) {
        console.error("Callback error:", error);
        toast.error("Đã có lỗi xảy ra");
        localStorage.removeItem("access_token");
        router.push("/auth/login");
      }
    };

    handleCallback();
  }, [router, searchParams, setGoogleAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Đang xử lý...</h1>
        <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}
