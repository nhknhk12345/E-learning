"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { quizApi } from "@/api/quiz";
import { toast } from "sonner";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { lectureApi } from "@/api/lectures";
import { Lecture } from "@/types/lecture";

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  timeLimit: z.coerce
    .number()
    .min(1, "Thời gian phải lớn hơn 0")
    .max(3600, "Thời gian tối đa là 3600 giây")
    .optional(),
  passingScore: z.coerce
    .number()
    .min(0, "Điểm đạt phải từ 0-100")
    .max(100, "Điểm đạt phải từ 0-100")
    .optional(),
  lectureId: z.string().min(1, "Vui lòng chọn bài giảng"),
});

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateQuizModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateQuizModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { data: lectures } = useQuery({
    queryKey: ["lectures"],
    queryFn: async () => {
      const response = await lectureApi.getAllLectures();
      return response.data.lectures as Lecture[];
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      timeLimit: 300,
      passingScore: 60,
      lectureId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      await quizApi.createQuiz(values);
      toast.success("Tạo bài kiểm tra thành công");
      form.reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể tạo bài kiểm tra";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo bài kiểm tra mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo bài kiểm tra mới
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề bài kiểm tra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập mô tả bài kiểm tra"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lectureId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bài giảng</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bài giảng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lectures?.map((lecture) => (
                        <SelectItem key={lecture._id} value={lecture._id}>
                          {lecture.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian (giây)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passingScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm đạt (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang tạo..." : "Tạo bài kiểm tra"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
