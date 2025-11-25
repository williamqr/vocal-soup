// example LoginScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator } from "react-native";
import { signInWithEmail } from "../services/auth";

export function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { user, session } = await signInWithEmail(email.trim(), password);
      console.log("Logged in:", user?.id, session?.access_token);

      // TODO: store token and navigate to main app
      // e.g. navigation.replace("Home");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 24 }}>
      <Text>Email</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      <Text>Password</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 12, padding: 8 }}
      />
      {errorMsg && <Text style={{ color: "red" }}>{errorMsg}</Text>}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Log In" onPress={handleLogin} />
      )}
      <Button
        title="Don't have an account? Sign up"
        onPress={() => navigation.navigate("Signup")}
      />
    </View>
  );
}
