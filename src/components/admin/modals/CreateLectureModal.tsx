"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { lectureApi } from "@/api/lectures";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { lessonApi } from "@/api/lessons";
import { Lesson } from "@/types/lesson";
import { CreateLectureDto, LectureType } from "@/types/lecture";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
  lessonId: z.string().min(1, "Vui lòng chọn bài học"),
  type: z.nativeEnum(LectureType, {
    required_error: "Vui lòng chọn loại bài giảng",
  }),
  text: z.string().optional(),
  video: z.any().optional(),
  duration: z.string().optional(),
});

interface CreateLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateLectureModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateLectureModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedType, setSelectedType] = useState<LectureType | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      lessonId: "",
      type: LectureType.MIXED,
      text: "",
      video: undefined,
      duration: "",
    },
  });

  const fetchLessons = async () => {
    try {
      const response = await lessonApi.getAllLessons({ page: 1, limit: 50 });
      if (response.data && response.data.lessons) {
        setLessons(response.data.lessons);
      } else {
        console.error("Invalid response structure:", response);
        toast.error("Không thể tải danh sách bài học");
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Không thể tải danh sách bài học");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLessons();
    }
  }, [isOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const lectureData: CreateLectureDto = {
        title: values.title,
        description: values.description,
        lessonId: values.lessonId,
        type: values.type,
        content: {
          text: values.text,
          video: values.video,
          duration: values.duration ? parseInt(values.duration) : undefined,
        },
      };
      await lectureApi.createLecture(lectureData);
      toast.success("Tạo bài giảng thành công");
      form.reset();
      setSelectedType(null);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Error creating lecture:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể tạo bài giảng";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo bài giảng mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo bài giảng mới cho bài học
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="lessonId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bài học</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bài học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lessons.map((lesson) => (
                        <SelectItem key={lesson._id} value={lesson._id}>
                          {lesson.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại bài giảng</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedType(value as LectureType);
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại bài giảng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={LectureType.MIXED}>Hỗn hợp</SelectItem>
                      <SelectItem value={LectureType.VIDEO}>Video</SelectItem>
                      <SelectItem value={LectureType.TEXT}>Văn bản</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tiêu đề bài giảng" {...field} />
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
                      placeholder="Nhập mô tả bài giảng"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(selectedType === LectureType.TEXT ||
              selectedType === LectureType.MIXED) && (
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nội dung bài giảng"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {(selectedType === LectureType.VIDEO ||
              selectedType === LectureType.MIXED) && (
              <>
                <FormField
                  control={form.control}
                  name="video"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>Video</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              onChange(file);
                            }
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thời lượng (giây)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập thời lượng"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Đang tạo..." : "Tạo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
