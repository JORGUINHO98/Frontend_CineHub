// screens/LoginScreen.tsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // 👈 Instalar: expo install expo-linear-gradient
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../config/config";

export default function LoginScreen() {
  const { signIn, signUp } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState(""); // Solo en registro
  const [telefono, setTelefono] = useState(""); // Solo en registro
  const [pais, setPais] = useState(""); // Solo en registro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setError("⚠️ Email y contraseña son obligatorios");
      return false;
    }
    
    if (!isLogin && !nombre.trim()) {
      setError("⚠️ El nombre es obligatorio para registrarse");
      return false;
    }
    
    if (password.length < 6) {
      setError("⚠️ La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp({ 
          email, 
          password, 
          nombre,
          telefono: telefono || "",
          pais: pais || ""
        });
      }
    } catch (err: any) {
      console.error(err);
      setError("⚠️ Verifica tus datos o intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0f0f0f", "#1a1a1a", "#000"]}
      style={styles.container}
    >
      <Text style={styles.logo}>🎬 CineHub</Text>
      <Text style={styles.title}>
        {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
      </Text>

      {!isLogin && (
        <>
          <TextInput
            placeholder="Nombre completo"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            placeholder="Teléfono (opcional)"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="País (opcional)"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={pais}
            onChangeText={setPais}
          />
        </>
      )}

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setIsLogin(!isLogin)}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.switchText}>
          {isLogin
            ? "¿No tienes cuenta? Regístrate aquí"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.primary,
    textShadowColor: "rgba(255,255,255,0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 30,
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 15,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  switchText: {
    color: "#bbb",
    fontSize: 14,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});
