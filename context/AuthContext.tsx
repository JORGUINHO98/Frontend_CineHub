// context/AuthContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken, authService } from "../services/api";
import { ExtendedUser } from "types";   // 👈 usamos ExtendedUser

type AuthContextType = {
  user: ExtendedUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  // === Cerrar sesión ===
  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove([
        "@cinehub_access",
        "@cinehub_refresh",
        "@cinehub_user",
      ]);
      setAuthToken();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // === Refrescar perfil desde backend ===
  const refreshUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      await AsyncStorage.setItem("@cinehub_user", JSON.stringify(profile));
    } catch (error: any) {
      console.error("Error refreshing user:", error);
      if (error.response?.status === 401) {
        await signOut();
      }
    }
  };

  // === Inicialización ===
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("@cinehub_access");
        const cachedUser = await AsyncStorage.getItem("@cinehub_user");

        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        if (token) {
          setAuthToken(token);
          await refreshUser();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        await signOut();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // === Iniciar sesión ===
  const signIn = async (email: string, password: string) => {
    try {
      await AsyncStorage.multiRemove([
        "@cinehub_access",
        "@cinehub_refresh",
        "@cinehub_user",
      ]);
      setAuthToken();

      const { access, refresh } = await authService.login(email, password);

      await AsyncStorage.setItem("@cinehub_access", access);
      await AsyncStorage.setItem("@cinehub_refresh", refresh);
      setAuthToken(access);

      await refreshUser();
    } catch (err) {
      console.error("Login error:", err);
      await signOut();
      throw err;
    }
  };

  // === Registrarse ===
  const signUp = async (userData: any) => {
    try {
      console.log("Attempting registration with data:", userData);
      await authService.register(userData);
      await signIn(userData.email, userData.password);
    } catch (error: any) {
      console.error("Registration error details:", error);
      await signOut();

      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.email) {
        throw new Error(`Email: ${error.response.data.email[0]}`);
      } else if (error.response?.data?.password) {
        throw new Error(`Contraseña: ${error.response.data.password[0]}`);
      } else if (error.response?.status === 400) {
        throw new Error("Datos inválidos. Verifica los campos.");
      } else if (error.response?.status === 500) {
        throw new Error("Error del servidor. Inténtalo más tarde.");
      } else {
        throw new Error("Error de conexión. Verifica tu internet.");
      }
    }
  };

  // === Actualizar perfil ===
  const updateProfile = async (userData: any) => {
    await authService.updateProfile(userData);
    await refreshUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
