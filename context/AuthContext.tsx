import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken, authService } from "../services/api";
import { ExtendedUser } from "types";

type AuthContextType = {
  user: ExtendedUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: { email: string; password: string; nombre: string }) => Promise<void>;
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

      const profile = await authService.getProfile();
      setUser(profile);
      await AsyncStorage.setItem("@cinehub_user", JSON.stringify(profile));
    } catch (error: any) {
      console.error("Login error:", error);
      await signOut();

      if (error.response?.status === 401) {
        throw new Error("Credenciales inválidas. Verifica tu email y contraseña.");
      }
      if (error.response?.status === 400) {
        throw new Error("Datos inválidos en el login.");
      }
      throw new Error("Error de conexión. Intenta más tarde.");
    }
  };

  const signUp = async (userData: { email: string; password: string; nombre: string }) => {
  try {
    console.log("🔵 signUp userData:", userData);
    await authService.register(userData);
    await signIn(userData.email, userData.password);
  } catch (error: any) {
    console.error("❌ SignUp error:", error.response?.data || error.message);
    throw error;
  }
};

  const updateProfile = async (userData: any) => {
    try {
      const updated = await authService.updateProfile(userData);
      setUser(updated);
      await AsyncStorage.setItem("@cinehub_user", JSON.stringify(updated));
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error("No se pudo actualizar el perfil.");
    }
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
