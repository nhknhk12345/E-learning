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
import { Lecture, LectureType } from "@/types/lecture";
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
  type: z.nativeEnum(LectureType, {
    required_error: "Vui lòng chọn loại bài giảng",
  }),
  text: z.string().optional(),
  video: z.any().optional(),
  duration: z.string().optional(),
});

interface UpdateLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lecture: Lecture;
}

export function UpdateLectureModal({
  isOpen,
  onClose,
  onSuccess,
  lecture,
}: UpdateLectureModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<LectureType>(lecture.type);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(
    lecture.content?.videoUrl || null
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: lecture.title,
      description: lecture.description,
      type: lecture.type,
      text: lecture.content?.text || "",
      video: undefined,
      duration: lecture.content?.duration?.toString() || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: lecture.title,
        description: lecture.description,
        type: lecture.type,
        text: lecture.content?.text || "",
        video: undefined,
        duration: lecture.content?.duration?.toString() || "",
      });
      setSelectedType(lecture.type);
      setCurrentVideoUrl(lecture.content?.videoUrl || null);
    }
  }, [isOpen, lecture, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Add basic fields
      if (values.title) formData.append("title", values.title);
      if (values.description)
        formData.append("description", values.description);
      if (values.type) formData.append("type", values.type);

      // Add content fields
      if (values.text) formData.append("content.text", values.text);
      if (values.duration) formData.append("content.duration", values.duration);
      if (values.video instanceof File) {
        formData.append("content.video", values.video);
      }

      await lectureApi.updateLecture(lecture._id, formData);
      toast.success("Cập nhật bài giảng thành công");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Error updating lecture:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể cập nhật bài giảng";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Cập nhật bài giảng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cho bài giảng
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <SelectItem value={LectureType.MIXED}>
                          Hỗn hợp
                        </SelectItem>
                        <SelectItem value={LectureType.VIDEO}>Video</SelectItem>
                        <SelectItem value={LectureType.TEXT}>
                          Văn bản
                        </SelectItem>
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
                        <FormLabel>
                          {currentVideoUrl ? "Thay thế video" : "Video"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                                setCurrentVideoUrl(URL.createObjectURL(file));
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
                  {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
              </div>
            </form>
          </Form>

          {(selectedType === LectureType.VIDEO ||
            selectedType === LectureType.MIXED) && (
            <div className="space-y-4">
              <h3 className="font-medium">Xem trước video</h3>
              {currentVideoUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <video
                    src={currentVideoUrl}
                    controls
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-lg border bg-muted">
                  <p className="text-sm text-muted-foreground">
                    Chưa có video để xem trước
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
