import type { FirebaseAuthTypes } from "@react-native-firebase/auth";

export interface VerifyOtpPageProps {
  phoneNumber: string;
  confirmation: FirebaseAuthTypes.ConfirmationResult;
  onBack: () => void;
  onSuccess: (user: FirebaseAuthTypes.User) => void;
}