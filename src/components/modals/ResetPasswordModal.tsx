"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .min(7, "Mã xác thực phải có 7 chữ số")
      .max(7, "Mã xác thực phải có 7 chữ số")
      .regex(/^[0-9]+$/, "Mã xác thực chỉ được chứa số"),
    newPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    token: string,
    email: string,
    newPassword: string,
    confirmPassword: string
  ) => Promise<void>;
  email: string;
  onResendCode: () => Promise<void>;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onSubmit,
  email,
  onResendCode,
}: ResetPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: ResetPasswordForm) => {
    setIsSubmitting(true);
    try {
      await onSubmit(
        values.token,
        email,
        values.newPassword,
        values.confirmPassword
      );
      form.reset();
      onClose();
    } catch (error: unknown) {
      type ErrorResponse = {
        response?: {
          status?: number;
          data?: {
            message?: string;
          };
        };
      };

      if (error && typeof error === "object" && "response" in error) {
        const err = error as ErrorResponse;

        if (err.response?.status === 404) {
          toast.error("Người dùng không tồn tại");
        } else if (err.response?.status === 400) {
          const message = err.response.data?.message;
          if (message === "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn") {
            toast.error(message, {
              action: {
                label: "Gửi lại mã",
                onClick: handleResendCode,
              },
            });
            form.setError("token", {
              type: "manual",
              message: "Mã xác thực không hợp lệ hoặc đã hết hạn",
            });
          } else if (message === "Mật khẩu mới không được giống mật khẩu cũ") {
            toast.error(message);
            form.setError("newPassword", {
              type: "manual",
              message: "Vui lòng chọn mật khẩu khác với mật khẩu cũ",
            });
          } else if (message) {
            toast.error(message);
          } else {
            toast.error("Dữ liệu không hợp lệ");
          }
        } else {
          toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
      } else {
        toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await onResendCode();
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error resending code:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đặt lại mật khẩu</DialogTitle>
          <DialogDescription>
            Nhập mã xác thực đã được gửi đến email {email} và mật khẩu mới của
            bạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã xác thực</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        maxLength={7}
                        placeholder="1234567"
                        {...field}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleResendCode}
                        disabled={countdown > 0 || isSubmitting}
                      >
                        {countdown > 0
                          ? `Gửi lại (${countdown}s)`
                          : "Gửi lại mã"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isSubmitting}
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
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
