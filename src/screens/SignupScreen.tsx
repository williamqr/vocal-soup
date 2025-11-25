import React, { useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator } from "react-native";
import { signUpWithEmail } from "../services/auth";

export function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setErrorMsg(null);
    setInfo(null);
    try {
      const { user } = await signUpWithEmail(email.trim(), password);
      console.log("Signed up user:", user?.id);

      // Depending on your Supabase email confirmation settings:
      // - you may need to tell user to check email
      setInfo("Check your email to confirm your account, then log in.");
      // or directly navigate to main app if session is active
      // navigation.replace("Home");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Signup failed");
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
      {info && <Text style={{ color: "green" }}>{info}</Text>}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Sign Up" onPress={handleSignup} />
      )}
      <Button
        title="Already have an account? Log in"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
}
