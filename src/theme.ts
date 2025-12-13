// src/theme.ts - Design tokens and theme constants

export const colors = {
  // Primary
  primary: "#F97316",
  primaryDark: "#EA580C",
  primaryLight: "#FB923C",

  // Background
  background: "#050816",
  surface: "#111827",
  surfaceLight: "#1F2937",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#F9FAFB",
  textTertiary: "#E5E7EB",
  textMuted: "#9CA3AF",
  textDim: "#6B7280",

  // Borders
  border: "#1F2937",
  borderLight: "#374151",
  borderDark: "#4B5563",

  // Status
  success: "#10B981",
  successLight: "#34D399",
  error: "#F87171",
  errorDark: "#DC2626",
  warning: "#FBBF24",
  info: "#3B82F6",

  // Accents
  accent: "#8B5CF6",
  accentBlue: "#2563EB",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const typography = {
  // Sizes
  xs: 11,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 36,

  // Weights (as string literals for React Native)
  light: "300" as const,
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Common component styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.md,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginBottom: spacing.sm,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.borderDark,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  secondaryButtonText: {
    color: colors.textTertiary,
    fontSize: typography.md,
    fontWeight: typography.medium,
  },
  textButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  textButtonText: {
    color: colors.textMuted,
    fontSize: typography.base,
    textDecorationLine: "underline" as const,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  commonStyles,
};