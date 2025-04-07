import { axiosInstance } from "./axios.config";
import type { ApiResponse } from "@/types/course";
import type { Course } from "@/types/course";
import type { PurchaseResponse } from "@/types/purchase";

export const purchaseApi = {
  purchaseCourse: (courseId: string) => {
    return axiosInstance.post<ApiResponse<PurchaseResponse>>(`/courses/${courseId}/purchase`);
  },

  getPurchaseHistory: () => {
    return axiosInstance.get<ApiResponse<Course[]>>("/purchases/history");
  },

  getPurchaseDetail: (purchaseId: string) => {
    return axiosInstance.get<ApiResponse<Course>>(`/purchases/${purchaseId}`);
  },
}; 