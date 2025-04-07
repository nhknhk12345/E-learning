"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (code: string, email: string) => Promise<void>;
  onResendCode: () => Promise<void>;
}

export function VerifyEmailModal({
  isOpen,
  onClose,
  email,
  onVerify,
  onResendCode,
}: VerifyEmailModalProps) {
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(7).fill("")
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Chỉ cho phép nhập 1 số

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto focus vào ô tiếp theo
    if (value !== "" && index < 6) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && verificationCode[index] === "" && index > 0) {
      // Focus vào ô trước đó khi xóa
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 7);
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 7) {
        newCode[i] = pastedData[i];
      }
    }

    setVerificationCode(newCode);
  };

  const handleVerify = async () => {
    const code = verificationCode.join("");
    if (code.length !== 7) {
      toast.error("Vui lòng nhập đủ mã xác thực");
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(code, email);
      toast.success("Xác thực email thành công");
      onClose();
    } catch {
      toast.error("Mã xác thực không đúng");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await onResendCode();
      setResendCountdown(60);
      toast.success("Đã gửi lại mã xác thực");
    } catch {
      toast.error("Không thể gửi lại mã xác thực");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xác thực email</DialogTitle>
          <DialogDescription>
            Vui lòng kiểm tra email {email} và nhập mã xác thực gồm 7 chữ số
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex justify-center gap-2">
            {verificationCode.map((digit, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-10 h-12 text-center text-lg"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                disabled={isVerifying}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleVerify} disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                "Xác thực"
              )}
            </Button>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={resendCountdown > 0 || isVerifying}
              >
                {resendCountdown > 0
                  ? `Gửi lại sau ${resendCountdown}s`
                  : "Gửi lại mã"}
              </Button>

              <Button variant="ghost" onClick={onClose} disabled={isVerifying}>
                Để sau
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
