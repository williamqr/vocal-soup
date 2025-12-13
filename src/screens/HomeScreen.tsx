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
import { Puzzle } from "../data/puzzles";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, borderRadius, typography, shadows } from "../theme";

export async function getAllPuzzlesFromDB(): Promise<Puzzle[]> {
  const { data, error } = await supabase
    .from("puzzles")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching all puzzles:", error);
    throw new Error(`Failed to load all puzzles: ${error.message}`);
  }

  const formattedPuzzles: Puzzle[] = (data || []).map((dbPuzzle: any) => ({
    id: dbPuzzle.id,
    title: dbPuzzle.title,
    content: dbPuzzle.content,
    fullAnswer: dbPuzzle.full_answer,
    parts: dbPuzzle.parts,
    hint: dbPuzzle.hint,
    surface: dbPuzzle.surface || "",
  }));

  return formattedPuzzles;
}

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user, loading: authLoading, isZh } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [dbPuzzles, setDbPuzzles] = useState<Puzzle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPuzzles = async () => {
      try {
        setLoading(true);
        const data = await getAllPuzzlesFromDB();
        setDbPuzzles(data);
      } catch (err: any) {
        console.error("Failed to load puzzles from DB:", err);
        setError(err.message ?? "Failed to load puzzles");
      } finally {
        setLoading(false);
      }
    };

    loadPuzzles();
  }, []);

  const renderPuzzleCard = ({ item, index }: { item: Puzzle; index: number }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Game", { puzzleId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.puzzleNumber}>
          <Text style={styles.puzzleNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDifficulty}>
            {isZh ? "点击开始" : "Tap to play"}
          </Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
      <Text style={styles.cardSurface} numberOfLines={2}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {isZh ? "欢迎回来" : "Welcome back"}
            </Text>
            <Text style={styles.title}>Vocal Soup</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("Settings")}
            activeOpacity={0.7}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {authLoading && !error && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>
              {isZh ? "正在加载..." : "Loading..."}
            </Text>
          </View>
        )}

        {user && (
          <View style={styles.userBadge}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.email?.charAt(0).toUpperCase() ?? "?"}
              </Text>
            </View>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>
          {isZh
            ? "选择一个谜题开始，每个都有自己的故事等待你发掘。"
            : "Choose a puzzle to start. Each one has its own story to uncover."}
        </Text>
        <View style={styles.puzzleCount}>
          <Text style={styles.puzzleCountText}>
            {dbPuzzles.length} {isZh ? "个谜题" : "puzzles"}
          </Text>
        </View>
      </View>

      {/* Puzzle List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingMessage}>
            {isZh ? "加载谜题中..." : "Loading puzzles..."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={dbPuzzles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={renderPuzzleCard}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: typography.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsIcon: {
    fontSize: 20,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  loadingText: {
    fontSize: typography.sm,
    color: colors.textMuted,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    color: colors.textPrimary,
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  userEmail: {
    fontSize: typography.sm,
    color: colors.textTertiary,
  },
  errorBanner: {
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  errorText: {
    fontSize: typography.sm,
    color: colors.error,
  },
  subtitleContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  subtitle: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textMuted,
    lineHeight: 20,
  },
  puzzleCount: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  puzzleCountText: {
    fontSize: typography.sm,
    color: colors.textTertiary,
    fontWeight: typography.medium,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  loadingMessage: {
    fontSize: typography.base,
    color: colors.textMuted,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  puzzleNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  puzzleNumberText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: typography.lg,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  cardDifficulty: {
    fontSize: typography.sm,
    color: colors.textDim,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    fontSize: typography.md,
    color: colors.textPrimary,
    fontWeight: typography.bold,
  },
  cardSurface: {
    fontSize: typography.base,
    color: colors.textMuted,
    lineHeight: 20,
  },
});

export default HomeScreen;