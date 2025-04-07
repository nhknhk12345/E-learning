"use client";

import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-md w-full px-4 py-8 text-center">
        <CircleX className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Thanh toán thất bại</h1>
        <div className="text-muted-foreground mb-4">
          <p className="mb-2">
            Giao dịch của bạn không thành công hoặc đã bị hủy.
          </p>
          <p>Vui lòng thử lại hoặc liên hệ với chúng tôi nếu cần hỗ trợ.</p>
        </div>
        <div className="space-y-2">
          <Button
            variant="default"
            className="w-full"
            onClick={() => router.push("/payment/deposit")}
          >
            Thử lại
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/")}
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
