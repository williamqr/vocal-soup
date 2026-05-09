// src/theme.ts — CIPHER design tokens
// Dark, watchful, ominous. One orange. Three voices.

export const colors = {
  // Brand
  primary: "#FF6A1A",       // CIPHER orange — the one warning
  primaryDark: "#E55A0F",
  primaryLight: "#FF8A4D",

  // Surfaces (dark)
  background: "#0A0A0F",    // near-black canvas
  surface: "#111118",       // raised surface (matches app icon)
  surfaceLight: "#1A1A22",  // slightly lighter (inputs, badges)
  surfaceElevated: "#222230",

  // Text (inverted ladder)
  textPrimary: "#F5F5F0",   // near-white, warm
  textSecondary: "#D4D4D0",
  textTertiary: "#A8A8A4",
  textMuted: "#6B6B6B",
  textDim: "#3F3F46",
  textInverse: "#0A0A0F",   // dark text on light fills (e.g. on primary button)

  // Borders
  border: "#1F1F2A",
  borderLight: "#2A2A36",
  borderDark: "#0F0F18",
  borderAccent: "#FF6A1A",

  // Status
  success: "#34D399",
  successDark: "#10B981",
  error: "#F87171",
  errorDark: "#DC2626",
  warning: "#FBBF24",
  info: "#60A5FA",

  // Tints (alpha overlays for banners)
  primaryTint: "rgba(255, 106, 26, 0.10)",
  successTint: "rgba(52, 211, 153, 0.12)",
  errorTint:   "rgba(248, 113, 113, 0.12)",
  scrim:       "rgba(0, 0, 0, 0.65)",
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

// ---- Type system ----
// Three voices:
//   serif  — what the GAME says (taglines, prompts, verdicts)
//   sans   — what the APP says (buttons, fields, plain UI)
//   mono   — what the SYSTEM says (labels, codes, metadata)
//   sansSC — Chinese shadow of `sans`
export const fonts = {
  serif: "InstrumentSerif_400Regular_Italic",
  serifRoman: "InstrumentSerif_400Regular",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemibold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
  mono: "JetBrainsMono_400Regular",
  monoMedium: "JetBrainsMono_500Medium",
  sansSC: "NotoSansSC_400Regular",
  sansSCBold: "NotoSansSC_700Bold",
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
  display: 40,

  // Weights (string literals for RN)
  light: "300" as const,
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
};

// Heavier shadows on near-black; glow reserved for live/listening surfaces.
export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  glow: {
    shadowColor: "#FF6A1A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  },
};

// ---- Common composed styles ----
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
  inputFocused: {
    borderColor: colors.primary,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.sm,
    fontFamily: fonts.mono,
    marginBottom: spacing.sm,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
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
    color: colors.textInverse,
    fontSize: typography.md,
    fontFamily: fonts.sansSemibold,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  secondaryButtonText: {
    color: colors.textSecondary,
    fontSize: typography.md,
    fontFamily: fonts.sansMedium,
  },
  textButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  textButtonText: {
    color: colors.textMuted,
    fontSize: typography.base,
    fontFamily: fonts.sans,
    textDecorationLine: "underline" as const,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  fonts,
  typography,
  shadows,
  commonStyles,
};
