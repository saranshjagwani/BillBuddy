/**
 * Phone Authentication Service
 *
 * Purpose:
 * Provides Firebase phone authentication utilities
 * for sending OTP and confirming OTP.
 *
 * Why this file exists:
 * - Keeps Firebase auth logic separate from UI
 * - Prevents duplication across login screens
 * - Provides a single source of truth for phone auth
 *
 * What this file owns:
 * - Sending OTP via Firebase
 * - Confirming OTP codes
 *
 * What this file must NOT do:
 * - UI logic
 * - Navigation
 * - State management
 */

import { getApp } from "@react-native-firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

const auth = getAuth(getApp());

/**
 * Sends OTP to the provided phone number.
 *
 * Automatically formats Indian numbers if needed.
 */
export async function sendOtp(
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  try {
    // Ensure phone number has country code
    const formattedNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`;

    return signInWithPhoneNumber(auth, formattedNumber);
  } catch (error) {
    console.error("sendOtp failed:", error);
    throw error;
  }
}

/**
 * Confirms OTP entered by the user.
 *
 * Uses Firebase confirmation object returned by sendOtp.
 */
export async function confirmOtp(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.UserCredential | null> {
  try {
    return confirmation.confirm(code);
  } catch (error) {
    console.error("confirmOtp failed:", error);
    throw error;
  }
}