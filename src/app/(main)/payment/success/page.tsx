"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePayment } from "@/hooks/usePayment";
import { useEffect } from "react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const { verifyPayment } = usePayment();

  useEffect(() => {
    if (orderCode) {
      verifyPayment.mutate(orderCode);
    }
  }, [orderCode]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Thanh toán thành công!</h1>
        <p className="text-muted-foreground mb-4">
          Mã đơn hàng của bạn là: {orderCode}
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/courses">Xem khóa học</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
