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
import { RegisterRequest } from "@/types/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { VerifyEmailModal } from "@/components/modals/VerifyEmailModal";
import { authApi } from "@/api/authentication";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, "Tên người dùng không được để trống")
      .min(3, "Tên người dùng phải có ít nhất 3 ký tự"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    password: z
      .string()
      .min(1, "Mật khẩu không được để trống")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, isRegisterLoading } = useAuth();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterForm) => {
    register(values as RegisterRequest, {
      onSuccess: () => {
        toast.success("Đăng ký thành công");
        setRegisteredEmail(values.email);
        setShowVerifyModal(true);
      },
      onError: (error) => {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
      },
    });
  };

  const handleVerify = async (token: string, email: string) => {
    try {
      await authApi.verifyEmail(email, token);
      router.push("/auth/login");
    } catch (error: unknown) {
      throw error;
    }
  };

  const handleResendCode = async () => {
    try {
      await authApi.resendVerificationCode(registeredEmail);
    } catch (error: unknown) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Đăng ký</CardTitle>
          <CardDescription>
            Tạo tài khoản mới để truy cập khóa học
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người dùng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên của bạn"
                        {...field}
                        disabled={isRegisterLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        disabled={isRegisterLoading}
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
                        disabled={isRegisterLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isRegisterLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isRegisterLoading}
              >
                {isRegisterLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng ký...
                  </>
                ) : (
                  "Đăng ký"
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:underline"
                >
                  Đăng nhập
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>

      <VerifyEmailModal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        email={registeredEmail}
        onVerify={handleVerify}
        onResendCode={handleResendCode}
      />
    </div>
  );
}
