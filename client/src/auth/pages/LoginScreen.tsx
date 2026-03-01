import React, { useState } from "react";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { LoginComponent } from "../components/Login-Component";
import VerifyOtpPage from "../components/Otp-Verify";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  function handleSuccess(user: FirebaseAuthTypes.User) {
    console.log("Signed in:", user.uid);
    // navigate to your app's home screen here
  }

  if (confirmation) {
    return (
      <VerifyOtpPage
        phoneNumber={phoneNumber}
        confirmation={confirmation}
        onBack={() => setConfirmation(null)}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <LoginComponent
      phoneNumber={phoneNumber}
      isFocused={isFocused}
      loading={loading}
      error={error}
      setPhoneNumber={setPhoneNumber}
      setIsFocused={setIsFocused}
      setLoading={setLoading}
      setError={setError}
      onOtpSent={setConfirmation}
    />
  );
}