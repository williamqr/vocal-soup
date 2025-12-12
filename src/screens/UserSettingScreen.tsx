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

export default function SettingsScreen({ navigation }: any) {
  const { user, language, isZh, setLanguage } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = async (lang: "en" | "zh") => {
    if (lang === language) return; // No change needed

    setSaving(true);
    setError(null);
    try {
      await updateUserLanguage(lang);
      setLanguage(lang); // Update context immediately
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
              <Text style={styles.memberText}>
                {isZh ? "会员" : "Member"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{isZh ? "语言" : "Language"}</Text>
        <View style={styles.card}>
          <View style={styles.langRow}>
            <TouchableOpacity
              style={[
                styles.langButton,
                language === "en" && styles.langButtonSelected,
              ]}
              onPress={() => handleLanguageChange("en")}
              disabled={saving}
            >
              <Text
                style={[
                  styles.langText,
                  language === "en" && styles.langTextSelected,
                ]}
              >
                English
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langButton,
                language === "zh" && styles.langButtonSelected,
              ]}
              onPress={() => handleLanguageChange("zh")}
              disabled={saving}
            >
              <Text
                style={[
                  styles.langText,
                  language === "zh" && styles.langTextSelected,
                ]}
              >
                中文
              </Text>
            </TouchableOpacity>
          </View>

          {saving && (
            <View style={styles.savingRow}>
              <ActivityIndicator size="small" color="#F97316" />
              <Text style={styles.savingText}>
                {isZh ? "正在保存..." : "Saving..."}
              </Text>
            </View>
          )}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* Logout Section */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{isZh ? "退出登录" : "Log Out"}</Text>
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Vocal Soup v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  profileInfo: {
    flex: 1,
  },
  emailText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
  },
  memberText: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 2,
  },
  langRow: {
    flexDirection: "row",
    gap: 12,
  },
  langButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: "#1F2937",
    alignItems: "center",
  },
  langButtonSelected: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  langText: {
    color: "#E5E7EB",
    fontWeight: "600",
  },
  langTextSelected: {
    color: "#fff",
  },
  savingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    gap: 8,
  },
  savingText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  errorText: {
    marginTop: 8,
    color: "#F87171",
    fontSize: 13,
    marginLeft: 4,
  },
  logoutButton: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  logoutText: {
    color: "#F87171",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#4B5563",
    fontSize: 12,
  },
});
