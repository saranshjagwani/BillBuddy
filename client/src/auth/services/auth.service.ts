import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

/**
 * Sends OTP to the given phone number with +91 country code.
 * Returns a ConfirmationResult to be used for OTP verification.
 */
export async function sendOtp(
  phoneNumber: string
): Promise<FirebaseAuthTypes.ConfirmationResult> {
  return await auth().signInWithPhoneNumber(`+91${phoneNumber}`);
}

/**
 * Confirms the OTP entered by the user.
 * Returns the signed-in user on success.
 */
export async function confirmOtp(
  confirmation: FirebaseAuthTypes.ConfirmationResult,
  code: string
): Promise<FirebaseAuthTypes.UserCredential | null> {
  return await confirmation.confirm(code);
}