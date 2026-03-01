export interface LoginComponentProps {
  phoneNumber: string;
  isFocused: boolean;
  loading: boolean;
  error: string | null;
  setIsFocused: (focused: boolean) => void;
  handleContinue: () => void;
  handleKeyPress?: (e: any) => void;
  handlePhoneChange: (value: string) => void;
}
