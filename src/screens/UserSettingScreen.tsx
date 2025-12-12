// src/screens/SettingsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { updateUserLanguage } from "../services/auth";
import { fetchMe } from "../lib/apiClient";
import { useIsFocused } from "@react-navigation/native";

export default function SettingsScreen({ navigation }: any) {
  const [language, setLanguage] = useState<"en" | "zh">("en");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused(); // reload when screen focused

  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      setLoading(true);
      try {
        const profile: any = await fetchMe();
        if (!mounted) return;
        const lang = profile?.language ?? "en";
        setLanguage(lang === "zh" ? "zh" : "en");
      } catch (err: any) {
        console.error("Failed to load profile in settings:", err);
        setError(err.message ?? "Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (isFocused) loadProfile();

    return () => {
      mounted = false;
    };
  }, [isFocused]);

  const handleSave = async (lang: "en" | "zh") => {
    setSaving(true);
    setError(null);
    try {
      await updateUserLanguage(lang);
      // Refresh profile (so fetchMe / useAuth data will include updated language)
      await fetchMe();
      setLanguage(lang);
      Alert.alert(lang === "zh" ? "已保存" : "Saved", lang === "zh" ? "语言已更新。" : "Language updated.");
    } catch (err: any) {
      console.error("Failed to update language:", err);
      setError(err.message ?? "Failed to save language");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>{language === "zh" ? "正在加载设置..." : "Loading settings..."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{language === "zh" ? "设置" : "Settings"}</Text>

      <Text style={styles.label}>{language === "zh" ? "语言" : "Language"}</Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.langButton,
            language === "en" && styles.langButtonSelected,
          ]}
          onPress={() => handleSave("en")}
          disabled={saving}
        >
          <Text style={[styles.langText, language === "en" && styles.langTextSelected]}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.langButton,
            language === "zh" && styles.langButtonSelected,
          ]}
          onPress={() => handleSave("zh")}
          disabled={saving}
        >
          <Text style={[styles.langText, language === "zh" && styles.langTextSelected]}>中文</Text>
        </TouchableOpacity>
      </View>

      {saving && (
        <View style={{ marginTop: 12 }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>
            {language === "zh" ? "正在保存..." : "Saving..."}
          </Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#050816",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050816",
  },
  heading: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  label: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  langButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
    backgroundColor: "#111827",
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
  errorText: {
    marginTop: 12,
    color: "#F87171",
  },
});
