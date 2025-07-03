import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function VerificationEmailPage() {
  const [value, setValue] = useState("");
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    await verifyEmail(value);

    // ✅ Get fresh state after calling verifyEmail
    const { error, isLoading: freshLoading } = useAuthStore.getState();

    if (!error && !freshLoading) {
      toast("Email verified", {
        description: "Your email has been verified successfully",
      });

      // ✅ Optionally navigate after verification
      // navigate("/login");
    } else if (error) {
      toast.error("Verification failed", {
        description: error,
      });
    }
  };

  return (
    <div className="space-y-2 flex flex-col w-full mx-auto justify-center mt-5 px-5">
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}>
        <InputOTPGroup className="mx-auto">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="text-center text-sm">
        {value === "" ? (
          <>Enter your Verification Email Code.</>
        ) : (
          <>You entered: {value}</>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading || value.length !== 6}
        className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg">
        {isLoading ? "Verifying..." : "Verify your Email"}
      </Button>
    </div>
  );
}
