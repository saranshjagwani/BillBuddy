import { getApp } from "@react-native-firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

const auth = getAuth(getApp());

/**
 * Send OTP
 */
export async function sendOtp(
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return await signInWithPhoneNumber(auth, `+91${phoneNumber}`);
}

/**
 * Confirm OTP
 */
export async function confirmOtp(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.UserCredential | null> {
  return await confirmation.confirm(code);
}