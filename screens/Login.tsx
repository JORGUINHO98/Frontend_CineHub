import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email || !password || (!isLogin && !nombre)) {
      setError("⚠️ Todos los campos son obligatorios");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp({ email, nombre, password });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "⚠️ Verifica tus datos o intenta más tarde.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>🎬 CineHub</Text>
        <Text style={styles.title}>
          {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
        </Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#ccc"
            value={nombre}
            onChangeText={setNombre}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#ccc"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? "🚀 Entrar" : "✨ Registrarse"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.switchText}>
            {isLogin
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // fondo negro puro
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#00ff88", // verde neón
    textShadowColor: "#0f0",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#00ff88", // verde fosforescente
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 12,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "700",
  },
  switchText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 14,
    fontSize: 14,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});
