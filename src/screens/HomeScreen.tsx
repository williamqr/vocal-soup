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
  Image,
  Modal,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useAuth } from "../context/AuthContext";
import { storyApi, type Game, type UserProfile } from "../lib/api";
import { colors, spacing, borderRadius, typography } from "../theme";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.lg * 3) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const GAME_IMAGES: Record<string, any> = {
  g_threeBrothers_01: require("../../assets/images/Gemini_Generated_Image_pahd7qpahd7qpahd.png"),
  celebrity_daughter_hat: require("../../assets/images/Gemini_Generated_Image_x2ju71x2ju71x2ju.png"),
};

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
  const { user, loading: authLoading, isZh } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    if (authLoading || !user?.id) return;

    const loadGames = async () => {
      try {
        setLoading(true);
        const [allGames, userGames, profile] = await Promise.all([
          storyApi.getGames(),
          storyApi.getUserGames(user.id),
          storyApi.getUserProfile(user.id),
        ]);

        // Merge per-user locked/completed status into game metadata
        const merged = allGames.map((game) => {
          const userStatus = userGames.find((s) => s.gameId === game.id);
          return {
            ...game,
            status: userStatus?.locked ? "locked" as const : game.status,
            completed: userStatus?.completed ?? false,
          };
        });

        setGames(merged);
        setUserProfile(profile);
      } catch (err: any) {
        console.error("Failed to load games:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGames();
  }, [authLoading, user?.id]);

  const handleCardPress = (item: Game) => {
    if (item.status !== "available" || !item.puzzleId) return;
    setSelectedGame(item);
  };

  const handlePlay = () => {
    if (!selectedGame) return;
    setSelectedGame(null);
    navigation.navigate("Game", { gameId: selectedGame.id, puzzleId: selectedGame.puzzleId });
  };

  const renderCardInner = (item: Game, isLocked: boolean) => (
    <>
      {isLocked && <View style={styles.lockedOverlay} />}
      <View style={styles.cardCenter}>
        {isLocked && (
          <Text style={styles.lockIcon}>
            {item.status === "premium" ? "★" : "🔒"}
          </Text>
        )}
      </View>
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
    </>
  );

  const renderCard = ({ item, index }: { item: Game; index: number }) => {
    const bgColor = CARD_COLORS[index % CARD_COLORS.length];
    const isLocked = item.status === "locked" || item.status === "premium";
    const cardStyle = [styles.card, { backgroundColor: bgColor }];
    const localImage = GAME_IMAGES[item.id];

    return (
      <TouchableOpacity
        activeOpacity={isLocked ? 1 : 0.8}
        onPress={() => handleCardPress(item)}
      >
        {localImage ? (
          <ImageBackground
            source={localImage}
            style={cardStyle}
            imageStyle={styles.cardImage}
          >
            {renderCardInner(item, isLocked)}
          </ImageBackground>
        ) : (
          <View style={cardStyle}>
            {renderCardInner(item, isLocked)}
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.container}>
      <Modal
        visible={selectedGame !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedGame(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedGame(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {selectedGame && GAME_IMAGES[selectedGame.id] ? (
              <Image source={GAME_IMAGES[selectedGame.id]} style={styles.modalImage} />
            ) : (
              <View style={styles.modalImagePlaceholder} />
            )}
            <View style={styles.modalContent}>
              <Text style={styles.modalGenre}>{selectedGame?.genre}</Text>
              <Text style={styles.modalIntro}>{selectedGame?.shortIntro}</Text>
              <TouchableOpacity style={styles.modalPlayButton} onPress={handlePlay} activeOpacity={0.8}>
                <Text style={styles.modalPlayText}>{isZh ? "开始" : "Play"}</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <View style={styles.header}>
        <Text style={styles.appTitle}>{isZh ? "谜题" : "Puzzles"}</Text>
        {userProfile && (
          <View style={styles.userLevelBadge}>
            <Text style={styles.userLevelText}>LV{userProfile.level}</Text>
          </View>
        )}
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
  userLevelBadge: {
    position: "absolute",
    left: spacing.lg,
    top: spacing.xxl + spacing.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  userLevelText: {
    fontSize: typography.xs,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    width: width * 0.78,
    overflow: "hidden",
  },
  modalImage: {
    width: "100%",
    height: 180,
  },
  modalImagePlaceholder: {
    width: "100%",
    height: 180,
    backgroundColor: colors.border,
  },
  modalContent: {
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  modalGenre: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  modalIntro: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  modalPlayButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.full,
  },
  modalPlayText: {
    color: colors.background,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
});

export default HomeScreen;
