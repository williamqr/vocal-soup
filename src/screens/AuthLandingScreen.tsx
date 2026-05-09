// src/screens/AuthLandingScreen.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { colors, spacing, borderRadius, typography, fonts, shadows } from "../theme";
import { CipherMark } from "../icons";

type Props = NativeStackScreenProps<RootStackParamList, "AuthLanding">;

export const AuthLandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundGlow} />

      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <CipherMark size={56} color={colors.primary} />
        </View>
        <Text style={styles.logo}>CIPHER</Text>
        <Text style={styles.eyebrow}>A VOICE-DRIVEN MYSTERY</Text>
        <Text style={styles.tagline}>
          The story is already over.{"\n"}You're alone in the room.
        </Text>
      </View>

      <View style={styles.featuresSection}>
        <View style={styles.featureItem}>
          <View style={styles.featureRule} />
          <Text style={styles.featureText}>Speak to ask. Listen to learn.</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureRule} />
          <Text style={styles.featureText}>Lateral puzzles in the spirit of 海龟汤.</Text>
        </View>
        <View style={styles.featureItem}>
          <View style={styles.featureRule} />
          <Text style={styles.featureText}>English or 中文 — your choice.</Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Enter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Signup")}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>Create an account</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Home")}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Continue as guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  backgroundGlow: {
    position: "absolute",
    top: "18%",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: colors.primary,
    opacity: 0.06,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.glow,
  },
  logo: {
    fontSize: typography.display,
    fontFamily: fonts.sansBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 4,
  },
  eyebrow: {
    fontSize: typography.xs,
    fontFamily: fonts.mono,
    color: colors.primary,
    letterSpacing: 2.5,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: typography.lg,
    fontFamily: fonts.serif,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 28,
  },
  featuresSection: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  featureRule: {
    width: 16,
    height: 1,
    backgroundColor: colors.primary,
  },
  featureText: {
    fontSize: typography.base,
    fontFamily: fonts.sans,
    color: colors.textTertiary,
    flex: 1,
  },
  buttonsContainer: {
    width: "100%",
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: "center",
    ...shadows.md,
  },
  primaryButtonText: {
    color: colors.textInverse,
    fontSize: typography.md,
    fontFamily: fonts.sansSemibold,
    letterSpacing: 2,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: "transparent",
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.full,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: typography.md,
    fontFamily: fonts.sansMedium,
  },
  skipButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: typography.base,
    fontFamily: fonts.sans,
    textDecorationLine: "underline",
  },
});

export default AuthLandingScreen;
