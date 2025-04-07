"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { AlertCircle, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePayment } from "@/hooks/use-payment";
import Image from "next/image";

const EXCHANGE_RATE = 1000;

// Hàm format số với dấu chấm
const formatNumberWithDot = (number: number) => {
  return new Intl.NumberFormat("vi-VN").format(number);
};

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Vui lòng nhập số tiền")
    .refine((value) => {
      // Kiểm tra có phải là số không
      const number = Number(value.replace(/\./g, ""));
      return !isNaN(number);
    }, "Số tiền không hợp lệ")
    .refine((value) => {
      // Kiểm tra có kết thúc bằng .000 không
      const number = Number(value.replace(/\./g, ""));
      return number % 1000 === 0;
    }, "Số tiền phải kết thúc bằng .000")
    .refine((value) => {
      // Kiểm tra giới hạn tối thiểu
      const number = Number(value.replace(/\./g, ""));
      return number >= 10000;
    }, "Số tiền tối thiểu là 10.000đ (10 coin)")
    .refine((value) => {
      // Kiểm tra giới hạn tối đa
      const number = Number(value.replace(/\./g, ""));
      return number <= 10000000;
    }, "Số tiền tối đa là 10.000.000đ (10.000 coin)"),
});

type FormValues = z.infer<typeof formSchema>;

export default function DepositPage() {
  const [previewCoins, setPreviewCoins] = useState(0);
  const { createPayment, isLoading } = usePayment();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  const showRuleToast = () => {
    toast.error(
      <div className="space-y-2">
        <p className="font-medium">Số tiền không hợp lệ!</p>
        <div className="text-sm space-y-1">
          <p>Quy định nạp tiền:</p>
          <ul className="list-disc list-inside">
            <li>Số tiền phải kết thúc bằng .000</li>
            <li>Tối thiểu: 10.000đ (10 coin)</li>
            <li>Tối đa: 10.000.000đ (10.000 coin)</li>
          </ul>
          <p>Ví dụ hợp lệ: 10.000đ, 50.000đ, 100.000đ</p>
        </div>
      </div>,
      {
        duration: 5000,
      }
    );
  };

  const onSubmit = async (values: FormValues) => {
    const amount = Number(values.amount.replace(/\./g, ""));

    // Kiểm tra lại một lần nữa trước khi submit
    if (
      isNaN(amount) ||
      amount < 10000 ||
      amount > 10000000 ||
      amount % EXCHANGE_RATE !== 0
    ) {
      showRuleToast();
      return;
    }

    createPayment({ amount });
  };

  // Format số tiền khi nhập
  const formatAmount = (value: string) => {
    // Loại bỏ tất cả ký tự không phải số
    const number = value.replace(/[^0-9]/g, "");
    if (!number) return "";

    // Format số với dấu chấm
    return formatNumberWithDot(Number(number));
  };

  // Format số tiền khi blur (mất focus)
  const formatAmountOnBlur = (value: string) => {
    const number = Number(value.replace(/\./g, ""));
    if (isNaN(number) || number === 0) return "";

    // Làm tròn xuống đến bội số của 1000 gần nhất
    const roundedNumber = Math.floor(number / 1000) * 1000;
    return formatNumberWithDot(roundedNumber);
  };

  // Tính số coin khi nhập tiền
  const calculateCoins = (value: string) => {
    const amount = Number(value.replace(/\./g, ""));
    if (isNaN(amount)) return 0;
    return Math.floor(amount / EXCHANGE_RATE);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-10">
      <div className="w-full max-w-md px-4">
        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 p-3 bg-primary/5 rounded-full w-fit">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Nạp tiền</CardTitle>
            <CardDescription>
              Nạp tiền vào tài khoản để mua khóa học
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="relative w-[120px] h-[40px]">
                <Image
                  src="/payos-logo.svg"
                  alt="PayOS"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="h-8 w-[1px] bg-border" />
              <div className="text-sm text-muted-foreground">
                Thanh toán an toàn qua cổng PayOS
              </div>
            </div>

            <Alert variant="destructive" className="bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Quy định nạp tiền</AlertTitle>
              <AlertDescription className="mt-2 text-sm">
                <ul className="list-disc pl-4 space-y-1.5">
                  <li>
                    Số tiền sẽ được quy đổi thành coin theo tỉ lệ:{" "}
                    <span className="font-medium">1.000đ = 1 coin</span>
                  </li>
                  <li>
                    Số tiền nạp tối thiểu là{" "}
                    <span className="font-medium">10.000đ (10 coin)</span>
                  </li>
                  <li>
                    Số tiền nạp tối đa là{" "}
                    <span className="font-medium">
                      10.000.000đ (10.000 coin)
                    </span>
                  </li>
                  <li>
                    <strong>
                      Số tiền nạp bắt buộc phải kết thúc bằng .000
                    </strong>
                    <div className="mt-1 text-[13px] opacity-90">
                      Ví dụ hợp lệ: 10.000đ, 50.000đ, 100.000đ
                      <br />
                      Ví dụ không hợp lệ: 10.500đ, 123.456đ
                    </div>
                  </li>
                </ul>
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!form.formState.isValid) {
                    showRuleToast();
                    return;
                  }
                  form.handleSubmit(onSubmit)(e);
                }}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Số tiền</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            disabled={isLoading}
                            onChange={(e) => {
                              const formatted = formatAmount(e.target.value);
                              field.onChange(formatted);
                              form.trigger("amount");
                              setPreviewCoins(calculateCoins(formatted));
                            }}
                            onBlur={(e) => {
                              const formatted = formatAmountOnBlur(
                                e.target.value
                              );
                              field.onChange(formatted);
                              form.trigger("amount");
                              setPreviewCoins(calculateCoins(formatted));
                            }}
                            placeholder="Nhập số tiền (VNĐ)"
                            className="text-lg pl-4 pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base font-medium text-muted-foreground">
                            đ
                          </span>
                        </div>
                      </FormControl>
                      <div className="mt-2 space-y-2">
                        {previewCoins > 0 && (
                          <div className="flex items-center gap-2">
                            <p className="text-sm">
                              Số coin nhận được:{" "}
                              <span className="font-medium text-primary">
                                {formatNumberWithDot(previewCoins)} coin
                              </span>
                            </p>
                            {form.formState.errors.amount && (
                              <p className="text-xs text-destructive">
                                (Không hợp lệ)
                              </p>
                            )}
                          </div>
                        )}
                        <FormMessage className="text-destructive" />
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full text-base h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Tiến hành thanh toán"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="justify-center pt-2 pb-6 text-sm text-muted-foreground">
            Thanh toán được bảo mật bởi PayOS
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
