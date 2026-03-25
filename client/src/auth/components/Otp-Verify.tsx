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
import type { VerifyOtpPageProps } from "../types/Verify-Component.types";
import Svg, { Path } from "react-native-svg";
import { useAppTheme } from "../../shared/provider/AppThemeProvider";
import useOtp from "../hooks/useOtp";

export default function VerifyOtpPage({
  phoneNumber,
  confirmation,
  onBack,
  onSuccess,
}: VerifyOtpPageProps) {
  const { theme ,isDarkMode} = useAppTheme();
  const {otp, error, resendTimer, loading, onDigitChange, onKeyPress, handleResend, inputRefs} = useOtp(confirmation, phoneNumber, onSuccess, onBack);

  const styles = makeStyles(theme.colors, isDarkMode);
  

  return (
    <KeyboardAvoidingView

      style={[styles.root, { backgroundColor: theme.colors.background }]}
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
            <BackIcon color={theme.colors.textSecondary} />
            <Text style={[styles.backText, { color: theme.colors.textSecondary }]}>
              Back
            </Text>
          </TouchableOpacity>

          {/* ── Icon ── */}
          <View style={styles.iconWrapper}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: isDarkMode ? theme.colors.surface : "#dbeafe" },
              ]}
            >
              <MailIcon color={theme.colors.primary} />
            </View>
          </View>

          {/* ── Title ── */}
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
              Verify OTP
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              We've sent a verification code to
            </Text>
            <Text style={[styles.phone, { color: theme.colors.textPrimary }]}>
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
                    backgroundColor:isDarkMode ? theme.colors.surface : theme.colors.background,
                    color: theme.colors.textPrimary,
                    borderColor: theme.colors.border,
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
                textContentType="telephoneNumber"
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
                { backgroundColor: isDarkMode ? "#2A1A1A" : "#fee2e2" },
              ]}
            >
              <ErrorIcon color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </View>
          )}

          {/* ── Loading ── */}
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Verifying...
              </Text>
            </View>
          )}

          {/* ── Resend ── */}
          <View style={styles.resendBlock}>
            <Text style={[styles.resendHint, { color: theme.colors.textSecondary }]}>
              Didn't receive the code?
            </Text>
            {resendTimer > 0 ? (
              <Text style={[styles.resendHint, { color: theme.colors.textSecondary }]}>
                Resend in{" "}
                <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
                  {resendTimer}s
                </Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={[styles.resendBtn, { color: theme.colors.primary }]}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ── Security Note ── */}
          <View style={[styles.infoBox, { borderTopColor: theme.colors.border }]}>
            <LockIcon color={theme.colors.textSecondary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
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

function makeStyles(C: any, isDarkMode: boolean) {
  return StyleSheet.create({
    root: { flex: 1
    },
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
      shadowOpacity: isDarkMode ? 0.4 : 0.08,
      shadowRadius: 16,
      borderWidth: isDarkMode ? 1 : 0,
      borderColor: isDarkMode ? C.border : "transparent",
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
      height: 45,
      borderWidth: 1.5,
      borderRadius: 12,
      fontSize: 18,
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
