// import type { ChangeEvent, KeyboardEvent} from "react";
// import { useState } from "react";
// import {  sendOtp } from "../services/auth.service";



// type Step = "PHONE" | "OTP";

// export function usePhoneAuth() {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const [isCaptcha, setIsCaptcha] = useState(false);
//   const [step, setStep] = useState<Step>("PHONE");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   /**
//    * WHY:
//    * Centralizes OTP send logic so UI never handles side-effects.
//    * Prevents duplicated logic across screens.
//    */
  
//   const handleContinue = async () => {
//     try {
//      setLoading(true);

     
//       await sendOtp(phoneNumber);
//       setStep("OTP");
//     } catch (err) {
//       console.error(err);
//       setIsCaptcha(true);
//       setPhoneNumber("");
//       setError("Something went wrong. Please try again.");

//       setTimeout(() => setError(""), 2000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * WHY:
//    * Keeps input sanitization out of UI.
//    * Guarantees phone is always valid everywhere.
//    */
//  const handlePhoneChange = (value: string) => {
//   setPhoneNumber(value.replace(/\D/g, "").slice(0, 10));
// };

//   const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       handleContinue();
//     }
//   };

//   return {
//     // state
//     phoneNumber,
//     isFocused,
//     step,
//     loading,
//     error,

//     // setters (UI-only concerns)
//     setIsFocused,
//     setStep,

//     // actions
//     handleContinue,
//     handlePhoneChange,
//     handleKeyPress,
//   };
// }

