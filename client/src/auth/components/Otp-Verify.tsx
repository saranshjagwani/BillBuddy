import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import type { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { confirmOtp } from "../services/auth.service";
import { LightColors, DarkColors } from "../../theme/color";
import Svg, { Path } from "react-native-svg";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VerifyOtpPageProps {
  phoneNumber: string;
  confirmation: FirebaseAuthTypes.ConfirmationResult;
  onBack: () => void;
  onSuccess: (user: FirebaseAuthTypes.User) => void;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackIcon({ color }: { color: string }) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
    >
      <Path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </Svg>
  );
}

function MailIcon({ color }: { color: string }) {
  return (
    <Svg
      width={44}
      height={44}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </Svg>
  );
}

function ErrorIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20" fill={color}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      />
    </Svg>
  );
}

function LockIcon({ color }: { color: string }) {
  return (
    <Svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
    >
      <Path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </Svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function VerifyOtpPage({
  phoneNumber,
  confirmation,
  onBack,
  onSuccess,
}: VerifyOtpPageProps) {
  const { colors } = useTheme();
  const scheme = useColorScheme();
  const C = scheme === "dark" ? DarkColors : LightColors;
  const isDark = scheme === "dark";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  useEffect(() => {
    if (otp.every((d) => d !== "")) handleVerify(otp.join(""));
  }, [otp]);

  const onDigitChange = (index: number, value: string) => {
  const cleaned = value.replace(/[^0-9]/g, "");

  const newOtp = [...otp]; // create new copy
  newOtp[index] = cleaned;
  setOtp(newOtp);

  if (cleaned && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};

  function onKeyPress(index: number, key: string) {
    if (key === "Backspace") {
      if (!otp[index] && index > 0) {
        const updated = [...otp];
        updated[index - 1] = "";
        setOtp(updated);
        inputRefs.current[index - 1]?.focus();
      } else {
        const updated = [...otp];
        updated[index] = "";
        setOtp(updated);
      }
    }
  }

  async function handleVerify(code: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await confirmOtp(confirmation, code);
      if (result?.user) {
        onSuccess(result.user);
      } else {        throw new Error("OTP verification failed. Please try again.");
      }
    } catch (e: any) {
      setError("Invalid OTP. Please check and try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  }

  function handleResend() {
    setOtp(Array(OTP_LENGTH).fill(""));
    setError(null);
    setResendTimer(RESEND_SECONDS);
    onBack();
  }

  const styles = makeStyles(colors, C, isDark);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: C.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* ── Back ── */}
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <BackIcon color={C.textSecondary} />
            <Text style={[styles.backText, { color: C.textSecondary }]}>
              Back
            </Text>
          </TouchableOpacity>

          {/* ── Icon ── */}
          <View style={styles.iconWrapper}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: isDark ? C.surface : "#dbeafe" },
              ]}
            >
              <MailIcon color={colors.primary} />
            </View>
          </View>

          {/* ── Title ── */}
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: C.textPrimary }]}>
              Verify OTP
            </Text>
            <Text style={[styles.subtitle, { color: C.textSecondary }]}>
              We've sent a verification code to
            </Text>
            <Text style={[styles.phone, { color: C.textPrimary }]}>
              +91 {phoneNumber}
            </Text>
          </View>

          {/* ── OTP Inputs ── */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                style={[
                  styles.otpInput,
                  {
                    backgroundColor:isDark ? C.surface : "#F5F5F5",
                    color: C.textPrimary,
                    borderColor: C.border,
                  },
                ]}
                value={digit}
                importantForAutofill="no"
                autoCorrect={false}
                autoComplete="off"
                onChangeText={(val) => onDigitChange(index, val)}
                onKeyPress={({ nativeEvent }) =>
                  onKeyPress(index, nativeEvent.key)
                }
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                editable={!loading}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* ── Error ── */}
          {error && (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: isDark ? "#2A1A1A" : "#fee2e2" },
              ]}
            >
              <ErrorIcon color={C.error} />
              <Text style={[styles.errorText, { color: C.error }]}>
                {error}
              </Text>
            </View>
          )}

          {/* ── Loading ── */}
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: C.textSecondary }]}>
                Verifying...
              </Text>
            </View>
          )}

          {/* ── Resend ── */}
          <View style={styles.resendBlock}>
            <Text style={[styles.resendHint, { color: C.textSecondary }]}>
              Didn't receive the code?
            </Text>
            {resendTimer > 0 ? (
              <Text style={[styles.resendHint, { color: C.textSecondary }]}>
                Resend in{" "}
                <Text style={{ color: colors.primary, fontWeight: "600" }}>
                  {resendTimer}s
                </Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={[styles.resendBtn, { color: colors.primary }]}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Security Note ── */}
          <View style={[styles.infoBox, { borderTopColor: C.border }]}>
            <LockIcon color={C.textSecondary} />
            <Text style={[styles.infoText, { color: C.textSecondary }]}>
              For your security, please don't share this code with anyone. It
              will expire in 10 minutes.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function makeStyles(colors: any, C: any, isDark: boolean) {
  return StyleSheet.create({
    root: { flex: 1 },
    scroll: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    card: {
      width: "100%",
      maxWidth: 420,
      backgroundColor: C.card,
      borderRadius: 24,
      padding: 28,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.4 : 0.08,
      shadowRadius: 16,
      elevation: 4,
      borderWidth: isDark ? 1 : 0,
      borderColor: isDark ? C.border : "transparent",
    },

    // Back
    backBtn: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
      marginBottom: 20,
      gap: 6,
    },
    backText: { fontSize: 14, fontWeight: "500" },

    // Icon
    iconWrapper: { alignItems: "center", marginBottom: 24 },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: "center",
      justifyContent: "center",
    },

    // Title
    titleBlock: { alignItems: "center", marginBottom: 28 },
    title: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
    subtitle: { fontSize: 14, marginBottom: 4 },
    phone: { fontSize: 16, fontWeight: "600" },

    // OTP — no color/bg here, all handled inline
    otpRow: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 10,
      marginBottom: 16,
    },
    otpInput: {
      width: 40,
      height: 52,
      borderWidth: 1.5,
      borderRadius: 12,
      fontSize: 20,
      fontWeight: "700",
    },

    // Error
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
      gap: 8,
    },
    errorText: { fontSize: 13, fontWeight: "500", flex: 1 },

    // Loading
    loadingRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      marginBottom: 16,
    },
    loadingText: { fontSize: 13, fontWeight: "500" },

    // Resend
    resendBlock: {
      alignItems: "center",
      gap: 6,
      marginTop: 8,
      marginBottom: 4,
    },
    resendHint: { fontSize: 13 },
    resendBtn: {
      fontSize: 13,
      fontWeight: "600",
      textDecorationLine: "underline",
    },

    // Info
    infoBox: {
      flexDirection: "row",
      alignItems: "flex-start",
      borderTopWidth: 1,
      marginTop: 24,
      paddingTop: 20,
      gap: 8,
    },
    infoText: { fontSize: 12, lineHeight: 18, flex: 1 },
  });
}
