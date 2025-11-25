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
import { puzzles } from "../data/puzzles";
import { fetchMe } from "../lib/apiClient";
import { signOut } from "../services/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type MeResponse = {
  id: string;
  email: string;
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMe();
        setMe(data);
      } catch (err: any) {
        console.error("Failed to load /me:", err);
        setError(err.message ?? "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
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
              <Text style={styles.profileLoadingText}>Loading profile...</Text>
            </View>
          )}

          {me && (
            <Text style={styles.userText}>
              Signed in as <Text style={styles.userEmail}>{me.email}</Text>
            </Text>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Choose a puzzle to start. Each one has its own story to uncover.
      </Text>

      <FlatList
        data={puzzles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Game", { puzzleId: item.id })}
          >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSurface} numberOfLines={2}>
              {item.surface}
            </Text>
            <Text style={styles.cardHintLabel}>Tap to start this puzzle</Text>
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
