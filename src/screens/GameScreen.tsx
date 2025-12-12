// src/screens/GameScreen.tsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Audio } from "expo-av";
import { Puzzle } from "../data/puzzles";
import { getPuzzleFromDB } from "../services/data";
import { useAuth } from "../context/AuthContext"; // 👈 New Import

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

export const GameScreen: React.FC<Props> = ({ route, navigation }) => {
  const { puzzleId } = route.params;

  const [puzzleData, setPuzzleData] = useState<Puzzle | null>(null);

  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true); // New state for loading
  const [completionPercent, setCompletionPercent] = useState<number>(0);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [lastRecordingUri, setLastRecordingUri] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number | null>(
    null
  );

  const recordingRef = useRef<Audio.Recording | null>(null);
  const { user, loading: authLoading } = useAuth(); // 👈 Get user and auth status
  const currentUserId = user?.id; // 👈 The User ID is now easily accessible

  // 👇 NEW: language from user profile (set elsewhere, e.g. login/settings)
  const language = (user as any)?.language ?? "en";
  const isZh = language === "zh";

  // Ask for mic permission once on mount
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === "granted");
      const data = await getPuzzleFromDB(puzzleId);
      setPuzzleData(data);
    })();
  }, []);

  useEffect(() => {
    // Only proceed if auth is not loading and we have a User ID
    if (!authLoading && currentUserId && !sessionId) {
      // Check if currentUserId is defined, if not, the user is not logged in.
      // You may navigate away or show an error if (user === null)
      startNewSession(currentUserId);
    } else if (!authLoading && !currentUserId) {
      // Handle case where user is not logged in
      console.warn("User is not logged in. Cannot start game session.");
      // Consider navigating to login screen here
    }
  }, [authLoading, currentUserId]);

  const startNewSession = async (userId: string) => {
    setIsLoadingSession(true);
    try {
      console.log(`Starting new session for puzzle ${puzzleId} and user ${userId}`);
      const response = await fetch(`https://backend-9hz3.onrender.com/story/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          puzzleId: puzzleId,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start story session: ${response.statusText}`);
      }

      const data = await response.json();
      const newSessionId = data.storySessionId; // Assuming the backend returns { sessionId: '...' }
      setSessionId(newSessionId);
      console.log("New Session ID obtained:", newSessionId);
    } catch (error) {
      console.error("Error starting new session:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoadingSession(false);
    }
  };

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

  // A helper function to upload the file to your backend server
  const uploadAudioForTranscription = async (audioUri: string) => {
    // 1. Create FormData object
    const formData = new FormData();
    setEvaluationResult('Evaluating...'); // 👈 Set a status message while waiting
    // Determine the filename and mime type for the file
    // Expo recordings are often m4a or wav, depending on your config.
    const fileType = 'audio/m4a';
    const fileName = `recording-${Date.now()}.m4a`;

    // 2. Append the file data.
    // The format is crucial for React Native/Expo to upload files.
    formData.append('audioFile', {
      uri: audioUri,
      type: fileType,
      name: fileName,
    } as any);

    try {
      console.log("Uploading audio file to backend...");
      // 3. Send the request to your backend's transcription endpoint
      const response = await fetch(`https://backend-9hz3.onrender.com/chat/transcribe?sessionId=${sessionId}`, {
        method: 'POST',
        // No 'Content-Type': 'multipart/form-data' header is needed;
        // fetch handles it automatically with the correct boundary when using FormData.
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Transcription Result:", data.evaluation);
      setEvaluationResult(data.evaluation);
      console.log("Transcription Completion:", data.completion);
      setCompletionPercent(data.completion * 100); // expecting 0–100

      // You can now set this text to a state variable (e.g., setTranscribedText(data.transcribedText))

    } catch (error) {
      console.error("Error during file upload or transcription:", error);
      setEvaluationResult("Error during transcription.");
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

      if (uri) {
        await uploadAudioForTranscription(uri);
      }
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

  if (!puzzleData || isLoadingSession) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>
          {isZh ? "正在加载谜题并启动会话..." : "Loading puzzle and starting session..."}
        </Text>
      </View>
    );
  }

  // If puzzle not found, show fallback UI
  if (!puzzleData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {isZh ? "未找到谜题。" : "Puzzle not found."}
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>
            {isZh ? "返回列表" : "Back to list"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!puzzleData || authLoading || isLoadingSession) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#F97316" />
        <Text style={styles.loadingText}>
          {authLoading
            ? (isZh ? "正在验证用户身份..." : "Authenticating user...")
            : (isZh ? "正在加载谜题并启动会话..." : "Loading puzzle and starting session...")}
        </Text>
      </View>
    );
  }

  // Handle case where user is NOT logged in but auth is done loading
  if (!currentUserId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {isZh ? "用户未登录。" : "User not logged in."}
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')} // Assuming you have a login screen
        >
          <Text style={styles.primaryButtonText}>
            {isZh ? "前往登录" : "Go to Login"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const micStatusText = (() => {
    if (isLoadingSession) return isZh ? "正在初始化游戏会话..." : "Initializing game session...";
    if (hasPermission === false) return isZh ? "麦克风权限被拒绝。" : "Microphone permission denied.";
    if (isRecording) return isZh ? "正在录音... 点击麦克风停止。" : "Recording... tap the mic to stop.";
    if (lastRecordingUri && recordingDuration != null) {
      return isZh
        ? `上次录音：${recordingDuration}s（尚未发送）`
        : `Last recording: ${recordingDuration}s (not sent anywhere yet)`;
    }
    return isZh
      ? "点击麦克风，用语音提问。"
      : "Tap the mic to ask your question by voice.";
  })();

  // Simple localized puzzle text (keeps your existing fields)
  const localizedTitle = puzzleData.title;
  const localizedContent = puzzleData.content;
  const localizedHint = puzzleData.hint;
  const localizedFullAnswer = puzzleData.fullAnswer;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Puzzle title */}
        <Text style={styles.title}>{localizedTitle}</Text>
        {/* 👇 Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(Math.max(completionPercent, 0), 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {isZh
              ? `已完成 ${Math.round(completionPercent)}%`
              : `${Math.round(completionPercent)}% solved`}
          </Text>
        </View>

        {/* Surface story */}
        <Text style={styles.label}>{isZh ? "谜题" : "Puzzle"}</Text>
        <Text style={styles.surface}>{localizedContent}</Text>

        {/* Hint section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => setShowHint((prev) => !prev)}
          >
            <Text style={styles.secondaryButtonText}>
              {showHint
                ? (isZh ? "隐藏提示" : "Hide Hint")
                : (isZh ? "显示提示" : "Show Hint")}
            </Text>
          </TouchableOpacity>

          {showHint && (
            <Text style={styles.hintText}>{localizedHint}</Text>
          )}
        </View>

        {/* Solution section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowSolution((prev) => !prev)}
          >
            <Text style={styles.primaryButtonText}>
              {showSolution
                ? (isZh ? "隐藏答案" : "Hide Solution")
                : (isZh ? "显示完整故事" : "Reveal Full Story")}
            </Text>
          </TouchableOpacity>

          {showSolution && (
            <>
              <Text style={styles.label}>
                {isZh ? "完整故事" : "Full Story"}
              </Text>
              <Text style={styles.solutionText}>{localizedFullAnswer}</Text>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.evaluationContainer}>
        {evaluationResult && (
          <Text style={[
            styles.evaluationText,
            evaluationResult === 'yes' && styles.evaluationTextSuccess,
            (evaluationResult === 'no' || evaluationResult === 'Error evaluating answer.') && styles.evaluationTextFailure,
          ]}>
            {evaluationResult === 'Evaluating...'
              ? (isZh ? '正在分析你的问题...' : 'Analyzing your question...')
              : (
                isZh
                  ? `评估结果: ${evaluationResult.toUpperCase()}`
                  : `Evaluation: ${evaluationResult.toUpperCase()}`
              )}
          </Text>
        )}
      </View>

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
  // 👇 NEW styles
  progressContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    width: "100%",
    height: 10,
    borderRadius: 999,
    backgroundColor: "#1F2937",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#F97316",
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: "#9CA3AF",
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
  evaluationContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  evaluationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E5E7EB', // Default color
  },
  evaluationTextSuccess: {
    color: '#10B981', // Green for 'yes'
  },
  evaluationTextFailure: {
    color: '#F87171', // Red for 'no' or error
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
  },
  loadingText: {
    color: '#E5E7EB',
    marginTop: 10,
    fontSize: 16,
  },
  sessionIdText: {
    color: '#6B7280',
    fontSize: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    textAlign: 'center',
  }
});
