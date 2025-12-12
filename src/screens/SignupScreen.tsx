import React, { useState } from "react";
import { View, TextInput, Button, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { signUpWithEmail } from "../services/auth";

export function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<"en" | "zh" | null>(null); // 👈 NEW
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setErrorMsg(null);
    setInfo(null);

    if (!language) {
      setLoading(false);
      setErrorMsg("Please choose a language.");
      return;
    }

    try {
      const { user } = await signUpWithEmail(
        email.trim(),
        password,
        { language } // 👈 pass to auth service / metadata
      );

      console.log("Signed up user:", user?.id);

      setInfo("Check your email to confirm your account, then log in.");
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

      {/* 👇 Language selection */}
      <Text style={{ marginTop: 12, marginBottom: 6 }}>Choose Language</Text>

      <View style={{ flexDirection: "row", marginBottom: 12, gap: 8 }}>
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: language === "en" ? "orange" : "#aaa",
            borderRadius: 6,
            flex: 1,
            alignItems: "center",
          }}
          onPress={() => setLanguage("en")}
        >
          <Text>English</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 1,
            borderColor: language === "zh" ? "orange" : "#aaa",
            borderRadius: 6,
            flex: 1,
            alignItems: "center",
          }}
          onPress={() => setLanguage("zh")}
        >
          <Text>中文</Text>
        </TouchableOpacity>
      </View>

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
