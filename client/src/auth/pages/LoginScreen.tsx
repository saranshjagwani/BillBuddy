/**
 * Login Screen
 *
 * Purpose:
 * Entry screen for phone authentication.
 * Handles the login flow using phone number + OTP verification.
 *
 * Why this file exists:
 * - Connects authentication logic (useLogin hook) with UI components.
 * - Decides whether to show phone input or OTP verification.
 *
 * What this file owns:
 * - Rendering correct authentication step
 * - Passing handlers between hook and UI
 *
 * What this file must NOT do:
 * - Implement authentication logic
 * - Perform Firebase calls
 * - Handle business rules
 *
 * Logic belongs inside hooks/services.
 */

import React from "react";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

import { LoginComponent } from "../components/Login-Component";
import VerifyOtpPage from "../components/Otp-Verify";
import { useLogin } from "../hooks/usePhoneAuth";



export default function Login() {
  /**
   * Hook containing authentication logic.
   * Manages phone input, OTP confirmation, loading state and errors.
   */
  const login = useLogin();

  /**
   * React Navigation instance
   */
 
  /**
   * Called when OTP verification succeeds.
   * User is authenticated and can enter the app.
   */
  function handleSuccess(user: FirebaseAuthTypes.User) {
    navigation.navigate("Home");
  }

  /**
   * Handles going back from OTP screen to phone input.
   */
  function handleOtpBack() {
    login.setConfirmation(null);
  }

  /**
   * Step 2: OTP Verification Screen
   *
   * If confirmation exists it means phone auth
   * request succeeded and user must verify OTP.
   */
  if (login.confirmation) {
    return (
      <VerifyOtpPage
        phoneNumber={login.phoneNumber}
        confirmation={login.confirmation}
        onBack={handleOtpBack}
        onSuccess={handleSuccess}
      />
    );
  }

  /**
   * Step 1: Phone Number Input Screen
   *
   * Displays login form and handles sending OTP.
   */
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