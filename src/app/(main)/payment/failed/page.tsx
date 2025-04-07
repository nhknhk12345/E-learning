"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status");

  const getErrorMessage = (status: string | null) => {
    switch (status) {
      case "CANCELLED":
        return "Bạn đã hủy giao dịch thanh toán";
      case "FAILED":
        return "Giao dịch thanh toán thất bại";
      default:
        return "Có lỗi xảy ra trong quá trình thanh toán";
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">
          Thanh toán không thành công!
        </h1>
        <p className="text-muted-foreground mb-4">
          {getErrorMessage(status)}
          {orderCode && <div>Mã đơn hàng: {orderCode}</div>}
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/payment/deposit">Thử lại</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
