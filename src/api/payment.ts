import { axiosInstance } from "./axios.config";
import { ApiSuccessResponse } from "@/types/response";

interface PaymentResponse {
  paymentUrl: string;
  orderCode: number;
}

class PaymentService {
  async createPayment(amount: number): Promise<PaymentResponse> {
    const response = await axiosInstance.post<ApiSuccessResponse<PaymentResponse>>("/payments/create", {
      amount,
    });

    if (!response.data.data.paymentUrl) {
      throw new Error("Không nhận được URL thanh toán");
    }

    return response.data.data;
  }
}

export const paymentService = new PaymentService(); 