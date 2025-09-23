// config/config.ts
const PORT = "8050";

// 👉 Detectar si estamos corriendo en navegador (Expo Web) o en móvil (Expo Go / APK)
const isWeb = typeof window !== "undefined";

// ⚠️ IMPORTANTE: cambia esta IP por la de tu PC en la red local cuando uses Expo Go en el celular
const LOCAL_IP = "192.168.0.10"

// 👉 Si estamos en web usar localhost, si es móvil usar IP local
const HOST = isWeb ? "localhost" : LOCAL_IP;

export const API_URL = `http://${HOST}:${PORT}/api`; // 👈 siempre con /api

export const TMDB_API_KEY =
  process.env.EXPO_PUBLIC_TMDB_API_KEY ||
  "22a739f55647e6f51ddabc877d2de6f2";

export const APP_CONFIG = {
  name: "CineHub",
  version: "1.0.0",
  apiTimeout: 30000, // ⏱️ subido a 30s para evitar falsos timeouts
  maxRetries: 3,
  cacheTimeout: 300000,
};

export const COLORS = {
  primary: "#00ff88",
  secondary: "#ff0080",
  accent: "#00d4ff",
  background: "#0a0a0a",
  surface: "#1a1a1a",
  surfaceVariant: "#2a2a2a",
  text: "#ffffff",
  textSecondary: "#b0b0b0",
  textMuted: "#666666",
  error: "#ff4444",
  warning: "#ffaa00",
  success: "#00ff88",
  border: "#333333",
  shadow: "rgba(0, 255, 136, 0.3)",
};

export const FONTS = {
  regular: "System",
  medium: "System",
  bold: "System",
  light: "System",
};
