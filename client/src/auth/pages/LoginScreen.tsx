import React, { useState } from "react";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { LoginComponent } from "../components/Login-Component";
import VerifyOtpPage from "../components/Otp-Verify";
import { useLogin } from "../hooks/usePhoneAuth";

export default function Login() {
  const login = useLogin();
  

  function handleSuccess(user: FirebaseAuthTypes.User) {
    console.log("Signed in:", user.uid);
    // navigation.navigate("Home");
  }

  if (login.confirmation) {
    return (
      <VerifyOtpPage
        phoneNumber={login.phoneNumber}
        confirmation={login.confirmation}
        onBack={() => login.setConfirmation(null)}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <LoginComponent
  phoneNumber={login.phoneNumber}
  isFocused={login.isFocused}
  isReady={login.isReady}
  loading={login.loading}
  error={login.error}
  setPhoneNumber={login.setPhoneNumber}
  setIsFocused={login.setIsFocused}
  handleContinue={login.handleContinue}
/>
  );
}