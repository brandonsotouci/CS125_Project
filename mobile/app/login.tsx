import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "./context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both email and password!");
      return;
    }

    setLoading(true);

    try {
      const base = `http://${process.env.EXPO_PUBLIC_COMPUTER_IP}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`;
      const res = await fetch(`${base}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: any = null;
      
      try {
        data = await res.json();
      } catch {
      }

      if (!res.ok) {
        setErrorMessage(data?.error ?? "Invalid credentials!");
        return;
      }

      if (!data?.token) {
        setErrorMessage("Login succeeded but no token was returned.");
        return;
      }
      await login(data.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.component}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

        <Button disabled={loading} title={loading ? "..." : "Login"} onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0D0D0D" },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", color: "white", marginBottom: 24 },
  component: { alignSelf: "center", padding: 24, borderRadius: 12 },
  input: {
    backgroundColor: "#242424",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 16,
    color: "white",
  },
  errorText: { color: "red" },
});