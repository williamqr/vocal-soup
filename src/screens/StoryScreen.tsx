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

type Props = NativeStackScreenProps<RootStackParamList, "Story">;

export const StoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { finalStory, openingText, storyChunks } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Your Adventure</Text>

        {openingText ? (
          <Text style={styles.storyText}>{openingText}</Text>
        ) : null}

        {storyChunks && storyChunks.length > 0 && (
          <View style={{ marginTop: 16 }}>
            {storyChunks.map((chunk, idx) => (
              <Text key={idx} style={styles.storyText}>
                {chunk}
              </Text>
            ))}
          </View>
        )}

        <Text style={[styles.storyText, { marginTop: 16 }]}>
          {finalStory}
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Back to puzzles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  storyText: {
    fontSize: 14,
    color: "#E5E7EB",
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#F9FAFB",
    fontWeight: "600",
    fontSize: 14,
  },
});
