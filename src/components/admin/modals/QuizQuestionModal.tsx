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
import { toast } from "sonner";
import { useState } from "react";
import { QuizQuestion, QuizOption } from "@/store/useQuizStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Check, X } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(1, "Vui lòng nhập nội dung câu hỏi"),
  type: z.enum(["single_choice", "multiple_choice", "true_false"], {
    required_error: "Vui lòng chọn loại câu hỏi",
  }),
  options: z
    .array(
      z.object({
        content: z.string().min(1, "Vui lòng nhập nội dung đáp án"),
        isCorrect: z.boolean(),
      })
    )
    .min(2, "Vui lòng thêm ít nhất 2 đáp án"),
  explanation: z.string().optional(),
  points: z.coerce.number().min(1, "Điểm phải lớn hơn 0").default(1),
});

interface QuizQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (question: QuizQuestion) => void;
  question?: QuizQuestion;
  quizId: string;
}

export function QuizQuestionModal({
  isOpen,
  onClose,
  onSuccess,
  question,
  quizId,
}: QuizQuestionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: question?.content || "",
      type: question?.type || "single_choice",
      options: question?.options || [
        { content: "", isCorrect: false },
        { content: "", isCorrect: false },
      ],
      explanation: question?.explanation || "",
      points: question?.points || 1,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Chuyển đổi options để thêm id
      const options: QuizOption[] = values.options.map((option, index) => ({
        id: question?.options?.[index]?.id || `temp-${index}`,
        content: option.content,
        isCorrect: option.isCorrect,
      }));

      onSuccess({
        _id: question?._id || "",
        content: values.content,
        type: values.type,
        options: options,
        explanation: values.explanation || "",
        points: values.points,
        quizId: quizId,
      });

      form.reset();
      onClose();
    } catch (error) {
      console.error("Error saving question:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể lưu câu hỏi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addOption = () => {
    const options = form.getValues("options");
    form.setValue("options", [...options, { content: "", isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    const options = form.getValues("options");
    if (options.length <= 2) {
      toast.error("Phải có ít nhất 2 đáp án");
      return;
    }
    form.setValue(
      "options",
      options.filter((_, i) => i !== index)
    );
  };

  const toggleCorrect = (index: number) => {
    console.log("Toggle correct for index:", index);
    const type = form.getValues("type");
    const currentOptions = form.getValues("options");

    if (type === "single_choice" || type === "true_false") {
      const newOptions = currentOptions.map((option, i) => ({
        ...option,
        isCorrect: i === index,
      }));
      form.setValue("options", newOptions);
    } else {
      const newOptions = [...currentOptions];
      newOptions[index] = {
        ...newOptions[index],
        isCorrect: !newOptions[index].isCorrect,
      };
      form.setValue("options", newOptions);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {question ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
          </DialogTitle>
          <DialogDescription>
            {question
              ? "Chỉnh sửa thông tin câu hỏi và các đáp án"
              : "Thêm câu hỏi mới với các đáp án"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung câu hỏi</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nhập nội dung câu hỏi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại câu hỏi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại câu hỏi" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single_choice">
                        Chọn một đáp án
                      </SelectItem>
                      <SelectItem value="multiple_choice">
                        Chọn nhiều đáp án
                      </SelectItem>
                      <SelectItem value="true_false">Đúng/Sai</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Các đáp án</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm đáp án
                </Button>
              </div>

              {form.watch("options").map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    {...form.register(`options.${index}.content`)}
                    placeholder={`Đáp án ${index + 1}`}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant={option.isCorrect ? "default" : "outline"}
                    size="icon"
                    onClick={() => toggleCorrect(index)}
                    className="shrink-0"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giải thích (tùy chọn)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập giải thích cho câu trả lời"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Điểm</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isLoading ? "Đang lưu..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
