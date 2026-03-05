import { useState, useCallback } from "react";
import { sendOtp } from "../services/auth.service";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {useGlobalLoading} from "../../shared/provider/GlobalLoadingProvider";

export function useLogin() {

  const {show,hide } = useGlobalLoading();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
    const [confirmation, setConfirmation] =
      useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  

  const isReady = phoneNumber.length === 10 && !loading;
  



  const handleContinue = useCallback(async () => {
  if (loading) return;

  if (!isReady) {
    setError("Please enter a valid 10-digit phone number.");
    return;
  }

  setLoading(true);
  setError(null);

  // start delayed loader
  const loaderTimer = setTimeout(() => {
    show();
  }, 2000);

  try {
    console.log("Attempting to send OTP to:", phoneNumber);

    const confirmation = await sendOtp(phoneNumber);

    setConfirmation(confirmation);

  } catch (err: any) {
    setError(
      err?.message ||
      "We couldn't send the OTP. Please check your connection and try again."
    );
  } finally {
    clearTimeout(loaderTimer); // ⭐ cancel timer
    setLoading(false);
    hide();
  }

}, [loading, phoneNumber]);

  return {
    phoneNumber,
    setPhoneNumber,
    isFocused,
    setIsFocused,
    loading,
    setLoading,
    error,
    setError,
    isReady,
    handleContinue,
    confirmation,
     setConfirmation,
  };
}