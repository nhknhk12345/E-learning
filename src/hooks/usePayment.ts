import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios.config";
import { useAuth } from "@/store/useAuthStore";
import { toast } from "sonner";
import { User } from "@/types/user";

interface VerifyPaymentDto {
  orderCode: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const usePayment = () => {
  const { user } = useAuth();

  const verifyPayment = useMutation({
    mutationFn: async (orderCode: string) => {
      // Chuyển đổi orderCode từ string sang number
      const numericOrderCode = parseInt(orderCode, 10);
      
      const verifyData: VerifyPaymentDto = {
        orderCode: numericOrderCode,
      };
      
      const response = await axiosInstance.post<{ data: { courseId: string } }>("/payments/verify", verifyData);
      return response.data;
    },
    onSuccess: (data) => {
      // Cập nhật danh sách khóa học đã mua trong store
      if (user && data.data.courseId) {
        const updatedUser: User = {
          ...user,
          boughtCourses: [...(user.boughtCourses || []), data.data.courseId],
        };
        // Cập nhật user trong localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
        // Reload trang để cập nhật state
        window.location.reload();
      }
      toast.success("Xác thực thanh toán thành công!");
    },
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xác thực thanh toán");
    },
  });

  return {
    verifyPayment,
  };
}; 