// src/screens/SignupScreen.tsx
import React, { useState } from "react";
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
} from "react-native";
import { signUpWithEmail } from "../services/auth";
import { colors, spacing, borderRadius, typography, fonts, shadows } from "../theme";
import { CheckIcon } from "../icons";

export function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState<"en" | "zh" | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSignup = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please enter email and password");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return;
    }

    if (!language) {
      setErrorMsg("Please choose a language");
      return;
    }

    setLoading(true);

    try {
      const { user } = await signUpWithEmail(email.trim(), password, { language });
      console.log("Signed up user:", user?.id);
      setSuccessMsg("Check your email to confirm. Then come back.");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>NEW CASE</Text>
          <Text style={styles.title}>Step into the room.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, focusedField === "email" && styles.inputFocused]}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              placeholder="your@email.com"
              placeholderTextColor={colors.textDim}
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, focusedField === "password" && styles.inputFocused]}
              secureTextEntry
              autoComplete="new-password"
              placeholder="At least 6 characters"
              placeholderTextColor={colors.textDim}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm</Text>
            <TextInput
              style={[styles.input, focusedField === "confirmPassword" && styles.inputFocused]}
              secureTextEntry
              autoComplete="new-password"
              placeholder="Once more"
              placeholderTextColor={colors.textDim}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Language</Text>
            <View style={styles.languageRow}>
              <TouchableOpacity
                style={[styles.languageButton, language === "en" && styles.languageButtonSelected]}
                onPress={() => setLanguage("en")}
                activeOpacity={0.85}
              >
                <Text style={[styles.languageText, language === "en" && styles.languageTextSelected]}>
                  English
                </Text>
                {language === "en" && <CheckIcon size={14} color={colors.textInverse} />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.languageButton, language === "zh" && styles.languageButtonSelected]}
                onPress={() => setLanguage("zh")}
                activeOpacity={0.85}
              >
                <Text style={[styles.languageText, styles.languageTextZh, language === "zh" && styles.languageTextSelected]}>
                  中文
                </Text>
                {language === "zh" && <CheckIcon size={14} color={colors.textInverse} />}
              </TouchableOpacity>
            </View>
          </View>

          {errorMsg && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {successMsg && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{successMsg}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={colors.textInverse} size="small" />
            ) : (
              <Text style={styles.primaryButtonText}>Open the case</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.linkButton}>
            <Text style={styles.linkText}>Enter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  header: { marginBottom: spacing.xl },
  eyebrow: {
    fontSize: typography.xs,
    fontFamily: fonts.mono,
    color: colors.primary,
    letterSpacing: 2.5,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xxxl,
    fontFamily: fonts.serif,
    color: colors.textPrimary,
    lineHeight: 38,
  },
  form: { gap: spacing.lg },
  inputGroup: { gap: spacing.sm },
  label: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontFamily: fonts.mono,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginLeft: spacing.xs,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
    color: colors.textPrimary,
    fontSize: typography.md,
    fontFamily: fonts.sans,
  },
  inputFocused: { borderColor: colors.primary, ...shadows.sm },
  languageRow: { flexDirection: "row", gap: spacing.md },
  languageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceLight,
  },
  languageButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  languageText: {
    color: colors.textTertiary,
    fontSize: typography.md,
    fontFamily: fonts.sansSemibold,
  },
  languageTextZh: { fontFamily: fonts.sansSCBold },
  languageTextSelected: { color: colors.textInverse },
  errorContainer: {
    backgroundColor: colors.errorTint,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: { color: colors.error, fontSize: typography.base, fontFamily: fonts.sans },
  successContainer: {
    backgroundColor: colors.successTint,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  successText: { color: colors.success, fontSize: typography.base, fontFamily: fonts.sans },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
    ...shadows.md,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: typography.md,
    fontFamily: fonts.sansSemibold,
    letterSpacing: 2,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  footerText: { color: colors.textMuted, fontSize: typography.base, fontFamily: fonts.sans },
  linkButton: { paddingVertical: spacing.xs },
  linkText: { color: colors.primary, fontSize: typography.base, fontFamily: fonts.sansSemibold },
});
