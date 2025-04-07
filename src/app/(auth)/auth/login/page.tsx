"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { LoginRequest } from "@/types/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ForgotPasswordModal } from "@/components/modals/ForgotPasswordModal";
import { ResetPasswordModal } from "@/components/modals/ResetPasswordModal";
import { authApi } from "@/api/authentication";
import { ApiErrorResponse } from "@/types/response";
import { AxiosError } from "axios";

const GoogleIcon = () => (
  <svg
    className="mr-2 h-4 w-4"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoginLoading, loginWithGoogle } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginRequest) => {
    login(values, {
      onSuccess: async () => {
        toast.success("Đăng nhập thành công");
        await router.push("/");
      },
      onError: (error: ApiErrorResponse) => {
        if (
          error.response.status === 401 &&
          error.response.data.message === "Tài khoản chưa được xác thực"
        ) {
          toast.error(
            "Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực tài khoản.",
            {
              action: {
                label: "Gửi lại email",
                onClick: () => {
                  authApi.resendVerificationCode(values.email);
                  toast.info("Đã gửi lại email xác thực");
                },
              },
            }
          );
          return;
        }

        toast.error(
          error.response.data.message ||
            "Đã có lỗi xảy ra, vui lòng thử lại sau"
        );
      },
    });
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await authApi.forgotPassword(email);
      setResetEmail(email);
      setShowForgotPassword(false);
      setShowResetPassword(true);
      toast.success("Vui lòng kiểm tra email để lấy mã xác thực");
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse;
        toast.error(
          apiError?.response.data.message ||
            "Đã có lỗi xảy ra, vui lòng thử lại sau"
        );
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
      throw error;
    }
  };

  const handleResetPassword = async (
    token: string,
    email: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      await authApi.resetPassword(token, email, newPassword, confirmPassword);
      toast.success("Đặt lại mật khẩu thành công, vui lòng đăng nhập lại");
      setShowResetPassword(false);
    } catch (error) {
      throw error;
    }
  };

  const handleResendResetCode = async () => {
    try {
      await authApi.forgotPassword(resetEmail);
      toast.success("Đã gửi lại mã xác thực");
    } catch (error) {
      if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiErrorResponse;
        toast.error(
          apiError?.response.data.message ||
            "Đã có lỗi xảy ra, vui lòng thử lại sau"
        );
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập để truy cập khóa học của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Nút đăng nhập Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            onClick={handleGoogleLogin}
            disabled={isLoginLoading}
          >
            {isLoginLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {isLoginLoading ? "Đang xử lý..." : "Đăng nhập với Google"}
          </Button>

          {/* Dòng phân cách */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                hoặc đăng nhập với email
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                        disabled={isLoginLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoginLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Quên mật khẩu?
                </Button>
                <Button type="submit" disabled={isLoginLoading}>
                  {isLoginLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/auth/register"
                  className="text-blue-600 hover:underline"
                >
                  Đăng ký
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onSubmit={handleForgotPassword}
      />

      <ResetPasswordModal
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        onSubmit={handleResetPassword}
        email={resetEmail}
        onResendCode={handleResendResetCode}
      />
    </div>
  );
}
