// App.tsx

import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { HomeScreen } from "./src/screens/HomeScreen";
import { GameScreen } from "./src/screens/GameScreen";
import { AuthLandingScreen } from "./src/screens/AuthLandingScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { SignupScreen } from "./src/screens/SignupScreen";
import { StoryScreen } from "./src/screens/StoryScreen";

import { AuthProvider, useAuth } from "./src/context/AuthContext";

export type RootStackParamList = {
  AuthLanding: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Game: { puzzleId: string };
  Story: {
    finalStory: string;
    openingText?: string;
    storyChunks?: string[];
  };
};

const AuthStack = createNativeStackNavigator<RootStackParamList>();
const AppStack = createNativeStackNavigator<RootStackParamList>();

const commonScreenOptions = {
  headerStyle: { backgroundColor: "#050816" },
  headerTintColor: "#fff",
  contentStyle: { backgroundColor: "#050816" },
};

// Screens shown when NOT logged in
function AuthStackNavigator() {
  return (
    <AuthStack.Navigator
      initialRouteName="AuthLanding"
      screenOptions={commonScreenOptions}
    >
      <AuthStack.Screen
        name="AuthLanding"
        component={AuthLandingScreen}
        options={{ title: "Welcome" }}
      />
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Log In" }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: "Sign Up" }}
      />
    </AuthStack.Navigator>
  );
}

// Screens shown when LOGGED IN
function AppStackNavigator() {
  return (
    <AppStack.Navigator
      initialRouteName="Home"
      screenOptions={commonScreenOptions}
    >
      <AppStack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Vocal Soup" }}
      />
      <AppStack.Screen
        name="Game"
        component={GameScreen}
        options={{ title: "Puzzle" }}
      />
      <AppStack.Screen
        name="Story"
        component={StoryScreen}
        options={{ title: "Your Story" }}
      />
    </AppStack.Navigator>
  );
}

// Chooses which stack to render based on auth state
function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Simple loading screen while we check Supabase session
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050816",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return user ? <AppStackNavigator /> : <AuthStackNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
