// App.tsx

import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";

import { HomeScreen } from "./src/screens/HomeScreen";
import { GameScreen } from "./src/screens/GameScreen";
import { AuthLandingScreen } from "./src/screens/AuthLandingScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignupScreen } from "./src/screens/SignupScreen";
import { StoryScreen } from "./src/screens/StoryScreen";
import SettingsScreen from "./src/screens/UserSettingScreen";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { useCipherFonts } from "./src/lib/useFonts";
import { colors } from "./src/theme";

// Required for OAuth redirect completion in Expo
WebBrowser.maybeCompleteAuthSession();

export type RootStackParamList = {
  AuthLanding: undefined;
  Home: undefined;
  Settings: undefined;
  Game: { gameId: string; puzzleId: string };
  Story: {
    finalStory: string;
    openingText?: string;
    storyChunks?: string[];
  };
  Login: { gameId?: string; puzzleId?: string } | undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const commonScreenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: colors.background },
};

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.primary,
  },
};

function RootNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={commonScreenOptions}>
      <Stack.Screen name="AuthLanding" component={AuthLandingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Story" component={StoryScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const fontsLoaded = useCipherFonts();

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
