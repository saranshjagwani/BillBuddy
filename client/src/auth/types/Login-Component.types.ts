import { Dispatch, SetStateAction } from "react";

export type LoginComponentProps = {
  phoneNumber: string;
  isFocused: boolean;
  isReady: boolean;
  loading: boolean;
  error: string | null;

  setPhoneNumber: Dispatch<SetStateAction<string>>;
  setIsFocused: Dispatch<SetStateAction<boolean>>;

  handleContinue: () => Promise<void>;
};