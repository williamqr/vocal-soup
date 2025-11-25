// src/screens/GameScreen.tsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { puzzles } from "../data/puzzles";
import { Audio } from "expo-av";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

export const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { puzzleId } = route.params;

  const puzzle = useMemo(
    () => puzzles.find((p) => p.id === puzzleId),
    [puzzleId]
  );

  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [lastRecordingUri, setLastRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number | null>(
    null
  );

  const recordingRef = useRef<Audio.Recording | null>(null);

  // Ask for mic permission once on mount
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const startRecording = async () => {
    try {
      // Ensure permission (in case useEffect hasn't finished yet)
      if (!hasPermission) {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          console.warn("Microphone permission not granted.");
          setHasPermission(false);
          return;
        }
        setHasPermission(true);
      }

      // Required on iOS to allow recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      setIsRecording(true);
      setRecordingDuration(null);

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      recordingRef.current = recording;
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording", error);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      const recording = recordingRef.current;
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setLastRecordingUri(uri ?? null);

      const status = await recording.getStatusAsync();
      if (status.isDoneRecording && status.durationMillis != null) {
        setRecordingDuration(Math.floor(status.durationMillis / 1000)); // seconds
      }

      recordingRef.current = null;
      console.log("Recording stopped, URI:", uri);

      // 👉 Later: send `uri` to your backend from here.
    } catch (error) {
      console.error("Error stopping recording", error);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  // If puzzle not found, show fallback UI
  if (!puzzle) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Puzzle not found.</Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>Back to list</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const micStatusText = (() => {
    if (hasPermission === false) return "Microphone permission denied.";
    if (isRecording) return "Recording... tap the mic to stop.";
    if (lastRecordingUri && recordingDuration != null) {
      return `Last recording: ${recordingDuration}s (not sent anywhere yet)`;
    }
    return "Tap the mic to ask your question by voice.";
  })();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Puzzle title */}
        <Text style={styles.title}>{puzzle.title}</Text>

        {/* Surface story */}
        <Text style={styles.label}>Puzzle</Text>
        <Text style={styles.surface}>{puzzle.surface}</Text>

        {/* Hint section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowHint((prev) => !prev)}
          >
            <Text style={styles.secondaryButtonText}>
              {showHint ? "Hide Hint" : "Show Hint"}
            </Text>
          </TouchableOpacity>

          {showHint && <Text style={styles.hintText}>{puzzle.hint}</Text>}
        </View>

        {/* Solution section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowSolution((prev) => !prev)}
          >
            <Text style={styles.primaryButtonText}>
              {showSolution ? "Hide Solution" : "Reveal Full Story"}
            </Text>
          </TouchableOpacity>

          {showSolution && (
            <>
              <Text style={styles.label}>Full Story</Text>
              <Text style={styles.solutionText}>{puzzle.solution}</Text>
            </>
          )}
        </View>
      </ScrollView>

      {/* Voice control area */}
      <View style={styles.voiceContainer}>
        <Text style={styles.voiceStatusText}>{micStatusText}</Text>

        <TouchableOpacity
          style={[
            styles.micButton,
            isRecording && styles.micButtonRecording,
            hasPermission === false && styles.micButtonDisabled
          ]}
          activeOpacity={0.8}
          onPress={toggleRecording}
          disabled={hasPermission === false}
        >
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816"
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16
  },
  label: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
    textTransform: "uppercase"
  },
  surface: {
    fontSize: 18,
    color: "#F9FAFB",
    marginBottom: 20,
    lineHeight: 24
  },
  section: {
    marginBottom: 24
  },
  secondaryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#6B7280",
    marginBottom: 8
  },
  secondaryButtonText: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "500"
  },
  hintText: {
    fontSize: 16,
    color: "#D1D5DB",
    lineHeight: 22
  },
  primaryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#F97316",
    marginBottom: 8
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600"
  },
  solutionText: {
    fontSize: 16,
    color: "#E5E7EB",
    lineHeight: 22,
    marginTop: 4
  },
  errorText: {
    flex: 1,
    color: "#FCA5A5",
    textAlign: "center",
    textAlignVertical: "center"
  },
  voiceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
    alignItems: "center",
    gap: 8
  },
  voiceStatusText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 4
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center"
  },
  micButtonRecording: {
    backgroundColor: "#DC2626"
  },
  micButtonDisabled: {
    opacity: 0.4
  },
  micIcon: {
    fontSize: 32,
    color: "#FFFFFF"
  }
});
