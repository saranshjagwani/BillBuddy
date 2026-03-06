import React from "react";
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
  Animated,
  Image,
} from "react-native";
import type { LoginComponentProps } from "../types/Login-Component.types";
import { useAppTheme } from "../../shared/provider/AppThemeProvider";

export function LoginComponent({
  phoneNumber,
  setPhoneNumber,
  isFocused,
  loading,
  error,
  isReady,
  setIsFocused,
  handleContinue,
}: LoginComponentProps) {
  const { theme } = useAppTheme();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.inner]}>
          {/* ── Logo ── */}
          <View style={styles.logoWrap}>
            <View
              style={[
                styles.logoBox,
                {
                  backgroundColor: "#FFD137",
                  borderColor: "#FFD137",
                  shadowColor: "#FFD137",
                },
              ]}
            >
              <Image
                source={require("../../../assets/BillBuddyLogo2.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* ── Heading ── */}
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            Welcome to BillBuddy
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.textSecondary ?? "#888" },
            ]}
          >
            Your smart shop assistant
          </Text>

          {/* ── Card ── */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                shadowColor: theme.colors.primary,
              },
            ]}
          >
            <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
              Phone number
            </Text>

            {/* Input */}
            <View
              style={[
                styles.inputRow,
                {
                  backgroundColor:
                    theme.colors.surface ?? theme.colors.background,
                  borderColor: isFocused
                    ? theme.colors.primary
                    : theme.colors.border,
                },
              ]}
            >
              <Text
                style={[styles.dialCode, { color: theme.colors.textPrimary }]}
              >
                {" "}
               +91
              </Text>
              <View
                style={[styles.sep, { backgroundColor: theme.colors.border }]}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.textPrimary }]}
                value={phoneNumber}
                onChangeText={(v) =>
                  setPhoneNumber(v.replace(/\D/g, "").slice(0, 10))
                }
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="number-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
                maxLength={10}
                placeholder="Enter 10-digit number"
                placeholderTextColor={"#BABABA"}
                editable={!loading}
                returnKeyType="done"
                onSubmitEditing={isReady ? handleContinue : undefined}
              />
            </View>

            {/* Hint / Error */}
            {error ? (
              <Text
                style={[
                  styles.error,
                  { color: theme.colors.error ?? "#D04B3A" },
                ]}
              >
                {error}
              </Text>
            ) : (
              <Text
                style={[
                  styles.hint,
                  { color: theme.colors.textSecondary ?? "#888" },
                ]}
              >
                We'll send a 6-digit OTP to this number
              </Text>
            )}

            {/* Button */}
            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: theme.colors.primary },
                !isReady && styles.btnDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isReady}
              activeOpacity={0.82}
            >
              {loading ? (
                <View style={styles.row}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.btnText}>Sending OTP…</Text>
                </View>
              ) : (
                <Text style={styles.btnText}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Footer ── */}
          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.textSecondary ?? "#888" },
              ]}
            >
              By continuing, you agree to our{" "}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.link, { color: theme.colors.primary }]}>
                Terms
              </Text>
            </TouchableOpacity>
            <Text
              style={[
                styles.footerText,
                { color: theme.colors.textSecondary ?? "#888" },
              ]}
            >
              {" "}
              &{" "}
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.link, { color: theme.colors.primary }]}>
                Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  inner: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },

  // Logo
  logoWrap: {
    alignItems: "center",
    marginBottom: 22,
  },
  logoBox: {
    width: 130,
    height: 130,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  logo: {
    width: 110,
    height: 110,
  },

  // Heading
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },

  // Card
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    gap: 12,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  // Input
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    height: 52,
  },
  dialCode: {
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: "600",
  },
  sep: {
    width: 1,
    height: 20,
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.5,
    height: "100%",
  },

  hint: {
    fontSize: 12,
  },
  error: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Button
  btn: {
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    opacity: 0.38,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  // Footer
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
  },
  link: {
    fontSize: 12,
    fontWeight: "700",
  },
});
