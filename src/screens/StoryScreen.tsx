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
import { useAuth } from "../context/AuthContext";
import { colors, spacing, borderRadius, typography, shadows } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Story">;

export const StoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { finalStory, openingText, storyChunks } = route.params;
  const { isZh } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.title}>
            {isZh ? "你的冒险故事" : "Your Adventure"}
          </Text>
          <Text style={styles.subtitle}>
            {isZh
              ? "恭喜你完成了这个谜题！"
              : "Congratulations on completing this puzzle!"}
          </Text>
        </View>

        {/* Story Content */}
        <View style={styles.storyCard}>
          {openingText && (
            <View style={styles.storySection}>
              <Text style={styles.sectionLabel}>
                {isZh ? "开篇" : "Opening"}
              </Text>
              <Text style={styles.storyText}>{openingText}</Text>
            </View>
          )}

          {storyChunks && storyChunks.length > 0 && (
            <View style={styles.storySection}>
              <Text style={styles.sectionLabel}>
                {isZh ? "你的问题之旅" : "Your Journey"}
              </Text>
              {storyChunks.map((chunk, idx) => (
                <View key={idx} style={styles.chunkContainer}>
                  <View style={styles.chunkNumber}>
                    <Text style={styles.chunkNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.chunkText}>{chunk}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.storySection}>
            <Text style={styles.sectionLabel}>
              {isZh ? "完整故事" : "The Full Story"}
            </Text>
            <View style={styles.finalStoryContainer}>
              <Text style={styles.finalStoryText}>{finalStory}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonIcon}>🏠</Text>
          <Text style={styles.primaryButtonText}>
            {isZh ? "返回谜题列表" : "Back to Puzzles"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  successIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.base,
    color: colors.textMuted,
    textAlign: "center",
  },
  storyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  storySection: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: typography.sm,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: typography.semibold,
    marginBottom: spacing.md,
  },
  storyText: {
    fontSize: typography.base,
    color: colors.textTertiary,
    lineHeight: 24,
  },
  chunkContainer: {
    flexDirection: "row",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  chunkNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  chunkNumberText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.textMuted,
  },
  chunkText: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textTertiary,
    lineHeight: 22,
  },
  finalStoryContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  finalStoryText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.md + 2,
    ...shadows.md,
  },
  buttonIcon: {
    fontSize: 18,
  },
  primaryButtonText: {
    color: colors.textPrimary,
    fontWeight: typography.semibold,
    fontSize: typography.md,
  },
});

export default StoryScreen;