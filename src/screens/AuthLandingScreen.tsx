// src/screens/AuthLandingScreen.tsx

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "AuthLanding">;

export const AuthLandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Vocal Soup</Text>
      <Text style={styles.tagline}>
        A voice-driven mystery game inspired by 海龟汤.
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.primaryButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Signup")}
        >
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.replace("Home")}
      >
        <Text style={styles.skipText}>Continue as guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12
  },
  tagline: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 32
  },
  buttonsContainer: {
    width: "100%",
    gap: 12
  },
  primaryButton: {
    backgroundColor: "#F97316",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center"
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#6B7280",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center"
  },
  secondaryButtonText: {
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "500"
  },
  skipButton: {
    marginTop: 24
  },
  skipText: {
    color: "#9CA3AF",
    fontSize: 14,
    textDecorationLine: "underline"
  }
});
