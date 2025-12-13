// src/screens/UserSettingScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import { updateUserLanguage, signOut } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, borderRadius, typography, shadows } from "../theme";

export default function SettingsScreen({ navigation }: any) {
  const { user, language, isZh, setLanguage } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = async (lang: "en" | "zh") => {
    if (lang === language) return;

    setSaving(true);
    setError(null);
    try {
      await updateUserLanguage(lang);
      setLanguage(lang);
      Alert.alert(
        lang === "zh" ? "已保存" : "Saved",
        lang === "zh" ? "语言已更新。" : "Language updated."
      );
    } catch (err: any) {
      console.error("Failed to update language:", err);
      setError(err.message ?? "Failed to save language");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      isZh ? "退出登录" : "Log Out",
      isZh ? "确定要退出登录吗？" : "Are you sure you want to log out?",
      [
        { text: isZh ? "取消" : "Cancel", style: "cancel" },
        {
          text: isZh ? "退出" : "Log Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (err) {
              console.error("Error during logout:", err);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isZh ? "设置" : "Settings"}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isZh ? "管理你的账户和偏好设置" : "Manage your account and preferences"}
        </Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{isZh ? "账户" : "Account"}</Text>
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() ?? "?"}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.emailText}>{user?.email ?? "Unknown"}</Text>
              <View style={styles.memberBadge}>
                <Text style={styles.memberText}>
                  {isZh ? "会员" : "Member"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{isZh ? "语言" : "Language"}</Text>
        <View style={styles.card}>
          <Text style={styles.cardDescription}>
            {isZh
              ? "选择你的首选语言"
              : "Choose your preferred language for the app"}
          </Text>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[
                styles.langButton,
                language === "en" && styles.langButtonSelected,
              ]}
              onPress={() => handleLanguageChange("en")}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text style={styles.langFlag}>🇺🇸</Text>
              <Text
                style={[
                  styles.langText,
                  language === "en" && styles.langTextSelected,
                ]}
              >
                English
              </Text>
              {language === "en" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langButton,
                language === "zh" && styles.langButtonSelected,
              ]}
              onPress={() => handleLanguageChange("zh")}
              disabled={saving}
              activeOpacity={0.7}
            >
              <Text style={styles.langFlag}>🇨🇳</Text>
              <Text
                style={[
                  styles.langText,
                  language === "zh" && styles.langTextSelected,
                ]}
              >
                中文
              </Text>
              {language === "zh" && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          </View>

          {saving && (
            <View style={styles.savingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.savingText}>
                {isZh ? "正在保存..." : "Saving..."}
              </Text>
            </View>
          )}
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{isZh ? "关于" : "About"}</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{isZh ? "版本" : "Version"}</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{isZh ? "应用名称" : "App"}</Text>
            <Text style={styles.aboutValue}>Vocal Soup</Text>
          </View>
        </View>
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>{isZh ? "退出登录" : "Log Out"}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isZh ? "用语音解开谜题" : "Solve mysteries with your voice"}
        </Text>
        <Text style={styles.footerBrand}>Vocal Soup</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.base,
    color: colors.textMuted,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDescription: {
    fontSize: typography.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.lg,
    ...shadows.sm,
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.bold,
  },
  profileInfo: {
    flex: 1,
  },
  emailText: {
    color: colors.textSecondary,
    fontSize: typography.md,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs,
  },
  memberBadge: {
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },
  memberText: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontWeight: typography.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  langRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  langButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceLight,
  },
  langButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  langFlag: {
    fontSize: 18,
  },
  langText: {
    color: colors.textTertiary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  langTextSelected: {
    color: colors.textPrimary,
  },
  checkmark: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
  savingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  savingText: {
    color: colors.textMuted,
    fontSize: typography.sm,
  },
  errorBanner: {
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sm,
  },
  aboutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  aboutLabel: {
    color: colors.textMuted,
    fontSize: typography.base,
  },
  aboutValue: {
    color: colors.textTertiary,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutIcon: {
    fontSize: 18,
  },
  logoutText: {
    color: colors.error,
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  footer: {
    alignItems: "center",
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    color: colors.textDim,
    fontSize: typography.sm,
    marginBottom: spacing.xs,
  },
  footerBrand: {
    color: colors.textMuted,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
});