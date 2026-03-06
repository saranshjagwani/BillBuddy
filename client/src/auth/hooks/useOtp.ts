import { useState, useEffect, useRef, useCallback } from "react";
import { TextInput } from "react-native";
import { sendOtp,confirmOtp } from "../services/auth.service";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {useGlobalLoading} from "../../shared/provider/GlobalLoadingProvider";
import { useLogin } from "./usePhoneAuth";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function useOtp(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  phoneNumber: string,
  onSuccess: (user: FirebaseAuthTypes.User) => void,
  onBack: () => void
) {
  const { show, hide } = useGlobalLoading();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(RESEND_SECONDS);
  const [loading, setLoading] = useState<boolean>(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (!resendTimer) return;

    const timer = setTimeout(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Auto verify
  useEffect(() => {
    if (otp.every(Boolean)) {
      handleVerify(otp.join(""));
    }
  }, [otp]);

  const onDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updated = [...otp];
    updated[index] = digit;

    setOtp(updated);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onKeyPress = (index: number, key: string) => {
    if (key === "Backspace") {
      const updated = [...otp];

      if (!otp[index] && index > 0) {
        updated[index - 1] = "";
        inputRefs.current[index - 1]?.focus();
      } else {
        updated[index] = "";
      }

      setOtp(updated);
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
          throw new Error();
        }
      } catch {
        setError("Invalid OTP. Please try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      } finally {
        hide();
        setLoading(false);
      }
    },
    [confirmation, onSuccess]
  );

  const handleResend = async () => {
    try {
      show();
      setLoading(true);

      await sendOtp(phoneNumber);

      setOtp(Array(OTP_LENGTH).fill(""));
      setError(null);
      setResendTimer(RESEND_SECONDS);

      onBack();
    } finally {
      hide();
      setLoading(false);
    }
  };

  return {
    otp,
    error,
    resendTimer,
    loading,
    inputRefs,
    onDigitChange,
    onKeyPress,
    handleResend,
  };
}