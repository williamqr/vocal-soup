// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useAuth } from "../context/AuthContext";
import { storyApi, type Game } from "../lib/api";
import { colors, spacing, borderRadius, typography } from "../theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.lg * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const CARD_COLORS = [
  "#1B3A2D",
  "#2A1F3D",
  "#1A2E3D",
  "#3D1F2A",
  "#2D2A1A",
  "#1A2D2D",
  "#2D1A1A",
  "#1F2A3D",
];


type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { loading: authLoading, isZh } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const data = await storyApi.getGames();
        setGames(data);
      } catch (err: any) {
        console.error("Failed to load games:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, []);

  const handleCardPress = (item: Game) => {
    if (item.status !== "available" || !item.puzzleId) return;
    navigation.navigate("Game", { gameId: item.id, puzzleId: item.puzzleId });
  };

  const renderCard = ({ item, index }: { item: Game; index: number }) => {
    const bgColor = CARD_COLORS[index % CARD_COLORS.length];
    const isLocked = item.status === "locked" || item.status === "premium";

    return (
      <TouchableOpacity
        activeOpacity={isLocked ? 1 : 0.8}
        onPress={() => handleCardPress(item)}
      >
        <ImageBackground
          source={{ uri: item.backgroundPicture || "" }}
          style={[styles.card, { backgroundColor: bgColor }]}
          imageStyle={styles.cardImage}
        >
          {/* Lock / premium overlay */}
          {isLocked && <View style={styles.lockedOverlay} />}

          {/* Center content */}
          <View style={styles.cardCenter}>
            {isLocked ? (
              <Text style={styles.lockIcon}>
                {item.status === "premium" ? "★" : "🔒"}
              </Text>
            ) : (
              <View style={styles.playButton}>
                <Text style={styles.playText}>{isZh ? "开始" : "Play"}</Text>
              </View>
            )}
          </View>

          {/* Bottom row */}
          <View style={styles.cardBottom}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{item.level}</Text>
            </View>
            <View style={styles.cardMeta}>
              <Text style={styles.genreText} numberOfLines={1}>
                {item.genre}
              </Text>
              <Text style={styles.introText} numberOfLines={1}>
                {item.shortIntro}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>{isZh ? "谜题" : "Puzzles"}</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("Settings")}
          activeOpacity={0.7}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {loading || authLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={renderCard}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.lg,
    paddingBottom: spacing.lg,
  },
  appTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  settingsButton: {
    position: "absolute",
    right: spacing.lg,
    top: spacing.xxl + spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsIcon: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
  row: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  cardImage: {
    borderRadius: borderRadius.xl,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  cardCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  playText: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  lockIcon: {
    fontSize: 28,
    opacity: 0.7,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  levelBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  levelText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: colors.textPrimary,
  },
  cardMeta: {
    flex: 1,
    gap: 2,
  },
  genreText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  introText: {
    fontSize: typography.xs,
    color: "rgba(255,255,255,0.6)",
  },
});

export default HomeScreen;
