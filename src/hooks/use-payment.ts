import { useMutation } from "@tanstack/react-query";
import { paymentService } from "@/api/payment";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ApiErrorResponse } from "@/types/response";

interface CreatePaymentDto {
  amount: number;
}

interface PaymentResponse {
  paymentUrl: string;
  orderCode: number;
}

export const usePayment = () => {
  const router = useRouter();

  const createPaymentMutation = useMutation<
    PaymentResponse,
    AxiosError<ApiErrorResponse>,
    CreatePaymentDto
  >({
    mutationFn: async (data) => {
      const response = await paymentService.createPayment(data.amount);
      return response;
    },
    onSuccess: (data) => {
      if (data.paymentUrl) {
        localStorage.setItem('lastPaymentOrderCode', data.orderCode.toString());
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      if (error.response?.status === 401) {
        const currentPath = window.location.pathname;
        router.push(`/auth/login?from=${currentPath}`);
        toast.error("Vui lòng đăng nhập để tiếp tục");
        return;
      }
      
      toast.error(error.response?.data?.message || "Không thể tạo giao dịch. Vui lòng thử lại sau.");
      console.error("Payment creation error:", error);
    },
  });

  return {
    createPayment: createPaymentMutation.mutate,
    isLoading: createPaymentMutation.isPending,
  };
}; 