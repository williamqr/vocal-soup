// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { fetchMe } from "../lib/apiClient";
import { signOut } from "../services/auth";
import { Puzzle } from "../data/puzzles";
import { supabase } from "../lib/supabaseClient"; // Import the standard client


export async function getAllPuzzlesFromDB(): Promise<Puzzle[]> {
  // 1. Use the standard client and select all rows
  const { data, error } = await supabase 
    .from('puzzles')
    .select('*')
    .order('id', { ascending: true }); // Optionally, order them logically

  if (error) {
    console.error('Error fetching all puzzles:', error);
    throw new Error(`Failed to load all puzzles: ${error.message}`);
  }

  // 2. Map the data from the database (snake_case) to your frontend interface (camelCase)
  const formattedPuzzles: Puzzle[] = (data || []).map((dbPuzzle: any) => ({
    id: dbPuzzle.id,
    title: dbPuzzle.title,
    content: dbPuzzle.content,
    fullAnswer: dbPuzzle.full_answer, 
    parts: dbPuzzle.parts,
    hint: dbPuzzle.hint,
    surface: dbPuzzle.surface || '' // Ensure surface is included if used in HomeScreen
  }));

  console.log('Loaded Puzzles:', formattedPuzzles.length);
  return formattedPuzzles;
}

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type MeResponse = {
  id: string;
  email: string;
  // 👇 NEW: language preference from profile, e.g. "en" | "zh"
  language?: "en" | "zh";
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbPuzzles, setDbPuzzles] = useState<Puzzle[]>([]);

  // 👇 Determine language from profile (default to English)
  const language = me?.language ?? "en";
  const isZh = language === "zh";

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMe();
        setMe(data as MeResponse);
        console.log(me?.language ?? "en");
      } catch (err: any) {
        console.error("Failed to load /me:", err);
        setError(err.message ?? "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();

    const loadPuzzles = async () => {
      try {
        const data = await getAllPuzzlesFromDB();
        setDbPuzzles(data);
      } catch (err: any) {
        console.error("Failed to load puzzles from DB:", err);
        // Concatenate or handle errors appropriately
        setError(prev => (prev ? prev + "\n" : "") + (err.message ?? "Failed to load puzzles"));
      }
    };

    loadPuzzles();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      // AuthContext listener will handle navigation stack swap
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header: title + user info + logout */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Vocal Soup</Text>

          {loadingProfile && !me && !error && (
            <View style={styles.profileRow}>
              <ActivityIndicator size="small" />
              <Text style={styles.profileLoadingText}>
                {isZh ? "正在加载个人信息..." : "Loading profile..."}
              </Text>
            </View>
          )}

          {me && (
            <Text style={styles.userText}>
              {isZh ? "当前登录：" : "Signed in as "} 
              <Text style={styles.userEmail}>{me.email}</Text>
            </Text>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>
            {isZh ? "退出登录" : "Log out"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {isZh
          ? "选择一个谜题开始，每个都有自己的故事等待你发掘。"
          : "Choose a puzzle to start. Each one has its own story to uncover."
        }
      </Text>

      <FlatList
        data={dbPuzzles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Game", { puzzleId: item.id })}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSurface} numberOfLines={2}>
              {item.content}
            </Text>
            <Text style={styles.cardHintLabel}>
              {isZh ? "点击开始这个谜题" : "Tap to start this puzzle"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  userText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  userEmail: {
    color: "#E5E7EB",
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    color: "#F87171",
    marginTop: 4,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  profileLoadingText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 8,
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4B5563",
    backgroundColor: "#111827",
  },
  logoutButtonText: {
    fontSize: 12,
    color: "#E5E7EB",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 6,
  },
  cardSurface: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 8,
  },
  cardHintLabel: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});

export default HomeScreen;
