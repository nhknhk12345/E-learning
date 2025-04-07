import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseApi } from "@/api/purchases";
import { useAuth } from "@/store/useAuthStore";
import { toast } from "sonner";

export const usePurchaseCourse = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  return useMutation({
    mutationFn: (courseId: string) => purchaseApi.purchaseCourse(courseId),
    onSuccess: (data, courseId) => {
      // Cập nhật state của user
      if (user) {
        setUser({
          ...user,
          boughtCourses: [...(user.boughtCourses || []), courseId],
          balance: user.balance - (data.data.course?.price || 0),
        });
      }

      // Invalidate các query liên quan
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.success("Mua khóa học thành công!");
    },
    onError: () => {
      toast.error("Mua khóa học thất bại. Vui lòng thử lại sau.");
    },
  });
}; 