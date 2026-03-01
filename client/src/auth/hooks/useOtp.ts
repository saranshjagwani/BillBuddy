// import { useState, useRef, useEffect } from "react";
// import { TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";
// import {  sendOtp, verifyOtp } from "../services/auth.service";
// import { useNavigation } from "@react-navigation/native";
// import { usePhoneAuth } from "./usePhoneAuth";

// /**
//  * useOtpAuth
//  *
//  * Owns OTP verification state + behavior for React Native.
//  *
//  * WHY this hook exists:
//  * - Keep OTP logic centralized
//  * - Keep UI simple
//  * - Prevent focus chaos
//  * - Auto-submit when complete
//  */
// export function useOtpAuth() {
//   const { phoneNumber } = usePhoneAuth();
//   const navigation = useNavigation<any>();

//   /**
//    * OTP stored as array for:
//    * - Per digit control
//    * - Focus management
//    * - Clean paste handling
//    */
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   /**
//    * Resend countdown
//    * Keeps user from spamming OTP
//    */
//   const [resendTimer, setResendTimer] = useState<number>(30);

//   /**
//    * React Native TextInput refs
//    */
//   const inputRefs = useRef<Array<TextInput | null>>([]);

//   /**
//    * Countdown effect
//    * Designed simple to avoid re-render storms
//    */
//   useEffect(() => {
//     if (resendTimer <= 0) return;

//     const timer = setTimeout(() => {
//       setResendTimer((prev) => prev - 1);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, [resendTimer]);

//   /**
//    * Setup invisible reCAPTCHA
//    * Required before OTP send/verify
//    *
//    * ⚠️ Assumes native-safe implementation
//    */
//   /**
//    * Auto verify when 6 digits complete
//    * Zero extra confirmation (Constitution aligned)
//    */
//   useEffect(() => {
//     const otpString = otp.join("");
//     if (otpString.length === 6 && !loading) {
//       handleVerify(otpString);
//     }
//   }, [otp]);

//   /**
//    * OTP Verification
//    *
//    * Why:
//    * - Centralize verification
//    * - Prevent double submit
//    * - Route based on shop existence
//    */
//   const handleVerify = async (otpString: string) => {
//     try {
//       setLoading(true);
//       setError("");

//       const user = await verifyOtp(otpString);

//       navigation.replace("HomeScreen");
//     } catch (err) {
//       /**
//        * Reset OTP fully to prevent partial state bugs
//        */
//       setError("Invalid OTP. Please try again.");
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Handle single digit input
//    *
//    * WHY:
//    * - Prevent non-numeric input
//    * - Auto move forward
//    */
//   const handleChange = (index: number, value: string) => {
//     if (!/^\d?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);
//     setError("");

//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   /**
//    * Backspace navigation
//    *
//    * WHY:
//    * - Prevent stuck cursor
//    * - Mimic native OTP UX
//    */
//   const handleKeyPress = (
//     index: number,
//     e: NativeSyntheticEvent<TextInputKeyPressEventData>
//   ) => {
//     if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   /**
//    * React Native Paste Handling
//    *
//    * RN doesn’t support ClipboardEvent like web.
//    * Instead, if user pastes full code into one field,
//    * we detect multi-digit input and distribute.
//    */
//   const handleFullPaste = (value: string) => {
//     const clean = value.replace(/\D/g, "").slice(0, 6);

//     if (clean.length > 1) {
//       const newOtp = clean.split("").concat(Array(6).fill("")).slice(0, 6);
//       setOtp(newOtp);

//       const lastIndex = Math.min(clean.length - 1, 5);
//       inputRefs.current[lastIndex]?.focus();
//     }
//   };

//   /**
//    * Resend OTP
//    *
//    * WHY:
//    * - Reset state cleanly
//    * - Prevent spam
//    * - Keep UX calm
//    */
//   const handleResend = async () => {
//     if (resendTimer !== 0) return;

//     try {
//       setResendTimer(30);
//       setError("");
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0]?.focus();

//       await sendOtp(phoneNumber);
//     } catch (err) {
//       setError("Failed to resend. Please try again.");
//     }
//   };

//   return {
//     otp,
//     loading,
//     error,
//     resendTimer,
//     handleChange,
//     handleKeyPress,
//     handleFullPaste,
//     handleResend,
//     inputRefs,
//   };
// }
