// src/screens/StoryScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { colors, spacing, borderRadius, typography, fonts, shadows } from "../theme";
import { useAuth } from "../context/AuthContext";

type Props = NativeStackScreenProps<RootStackParamList, "Story">;

export const StoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { finalStory, openingText, storyChunks } = route.params;
  const { isZh } = useAuth();

  const chunks =
    storyChunks && storyChunks.length > 0
      ? storyChunks
      : finalStory.split(/\n\s*\n/).filter(Boolean);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.eyebrow}>{isZh ? "完整故事" : "THE FULL STORY"}</Text>
        <Text style={styles.title}>
          {isZh ? "真相大白。" : "The truth, in full."}
        </Text>
        <View style={styles.divider} />

        {openingText ? (
          <View style={styles.openingCard}>
            <Text style={styles.openingLabel}>
              {isZh ? "开篇" : "Opening"}
            </Text>
            <Text style={styles.openingText}>{openingText}</Text>
          </View>
        ) : null}

        {chunks.map((chunk, idx) => (
          <View key={idx} style={styles.chunkRow}>
            <Text style={styles.chunkNumber}>
              {String(idx + 1).padStart(2, "0")}
            </Text>
            <Text style={styles.chunkText}>{chunk}</Text>
          </View>
        ))}

        <View style={styles.endMark}>
          <View style={styles.endRule} />
          <Text style={styles.endText}>{isZh ? "完" : "END"}</Text>
          <View style={styles.endRule} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.primaryButtonText}>
            {isZh ? "返回档案" : "Back to cases"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.xxl,
  },
  eyebrow: {
    fontSize: typography.xs,
    fontFamily: fonts.mono,
    color: colors.primary,
    letterSpacing: 2.5,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.xxl,
    fontFamily: fonts.serif,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  openingCard: {
    backgroundColor: colors.surface,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  openingLabel: {
    fontSize: typography.xs,
    fontFamily: fonts.mono,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  openingText: {
    fontSize: typography.md,
    fontFamily: fonts.serif,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  chunkRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  chunkNumber: {
    fontSize: typography.sm,
    fontFamily: fonts.mono,
    color: colors.primary,
    paddingTop: 4,
    minWidth: 28,
  },
  chunkText: {
    flex: 1,
    fontSize: typography.md,
    fontFamily: fonts.serif,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  endMark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  endRule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  endText: {
    fontSize: typography.xs,
    fontFamily: fonts.mono,
    color: colors.textMuted,
    letterSpacing: 3,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
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
});

export default StoryScreen;
