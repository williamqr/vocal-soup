// src/screens/HomeScreen.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { puzzles } from "../data/puzzles";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vocal Soup</Text>
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
            onPress={() =>
              navigation.navigate("Game", { puzzleId: item.id })
            }
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
    paddingTop: 32
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16
  },
  listContent: {
    paddingBottom: 24
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937"
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 6
  },
  cardSurface: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 8
  },
  cardHintLabel: {
    fontSize: 12,
    color: "#9CA3AF"
  }
});
