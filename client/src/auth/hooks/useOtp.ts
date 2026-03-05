import { useState, useEffect, useRef, useCallback } from "react";
import { TextInput } from "react-native";
import { confirmOtp } from "../services/auth.service";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {useGlobalLoading} from "../../shared/provider/GlobalLoadingProvider";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function useOtp(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  onSuccess: (user: FirebaseAuthTypes.User) => void,
  onBack: () => void
) {
  const {show,hide } = useGlobalLoading();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const id = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [resendTimer]);

  // Verify when OTP complete
  useEffect(() => {
    if (otp.every((d) => d !== "")) {
      handleVerify(otp.join(""));
    }
  }, [otp]);

  const onDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);

    const updated = [...otp];
    updated[index] = cleaned;

    setOtp(updated);

    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (index: number, key: string) => {
    if (key === "Backspace") {
      const updated = [...otp];

      if (!otp[index] && index > 0) {
        updated[index - 1] = "";
        setOtp(updated);
        inputRefs.current[index - 1]?.focus();
      } else {
        updated[index] = "";
        setOtp(updated);
      }
    }
  };

  const handleVerify = useCallback(
    async (code: string) => {
      setLoading(true);
      show();
      setError(null);

      try {
        const result = await confirmOtp(confirmation, code);

        if (result?.user) {
          onSuccess(result.user);
        } else {
          throw new Error("OTP verification failed");
        }
      } catch {
        setError("Invalid OTP. Please check and try again.");

        setOtp(Array(OTP_LENGTH).fill(""));

        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } finally {
        hide();
        setLoading(false);
      }
    },
    [confirmation, onSuccess]
  );

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setError(null);
    setResendTimer(RESEND_SECONDS);
    onBack();
  };

  return {
    otp,
    loading,
    error,
    resendTimer,
    inputRefs,
    onDigitChange,
    onKeyPress,
    handleResend,
  };
}