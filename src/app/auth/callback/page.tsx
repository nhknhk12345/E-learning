"use client";

import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { authApi } from "@/api/authentication";
import { setAccessToken } from "@/api/axios.config";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const { setGoogleAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const access_token = searchParams.get("access_token");

      if (!access_token) {
        toast.error("Đăng nhập thất bại");
        window.location.replace("/auth/login");
        return;
      }

      try {
        setAccessToken(access_token);

        const response = await authApi.getMe();
        setGoogleAuth(response.data, access_token);
        toast.success("Đăng nhập thành công");
        
        window.location.replace("/courses");
      } catch (error) {
        console.error("Error getting user info:", error);
        toast.error("Đăng nhập thất bại");
        window.location.replace("/auth/login");
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Đang xử lý đăng nhập...</h2>
        <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}