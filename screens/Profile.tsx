
import React, { useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  StyleSheet,
  FlatList,
  useColorScheme,
  Image,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList, Movie } from "../types";
import { AuthContext } from "../context/AuthContext";
import { MovieContext } from "../context/MovieContext";
import { COLORS } from "../config/config";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { user, signOut } = useContext(AuthContext);
  const { favorites, watched, refreshMovies } = useContext(MovieContext);
  const navigation = useNavigation<NavigationProp>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // 🔄 refresca favoritos/vistos cada vez que vuelves al perfil
  useFocusEffect(
    useCallback(() => {
      refreshMovies();
    }, [refreshMovies])
  );

  const getInitials = (name?: string, email?: string) => {
    if (name?.trim()) {
      const parts = name.trim().split(" ");
      return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
    }
    if (email) return email[0].toUpperCase();
    return "?";
  };

  const renderMovieRow = (data: Movie[]) => {
    if (data.length === 0) {
      return (
        <Text style={[styles.emptyText, { color: isDark ? "#aaa" : "#555" }]}>
          No tienes películas aún
        </Text>
      );
    }
    return (
      <FlatList
        data={data}
        horizontal
        keyExtractor={(m) => m.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const poster = item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : item.poster ||
              "https://via.placeholder.com/120x180.png?text=No+Image";
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MovieDetail", {
                  movieId: item.id,
                  movie: item,
                })
              }
              style={{ alignItems: "center", marginHorizontal: 6 }}
            >
              <Image source={{ uri: poster }} style={styles.poster} />
              {/* ⭐ Mostrar calificación si existe */}
              {item.calificacion ? (
                <Text style={{ color: "#FFD700", marginTop: 4 }}>
                  ⭐ {item.calificacion}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : COLORS.background },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(user?.nombre, user?.email)}
          </Text>
        </View>
        <Text style={[styles.userName, { color: COLORS.primary }]}>
          {user?.nombre || "Usuario"}
        </Text>
        <Text
          style={[
            styles.userEmail,
            { color: isDark ? "#aaa" : "rgba(0,0,0,0.6)" },
          ]}
        >
          {user?.email || "—"}
        </Text>
      </View>

      {/* Stats */}
      <View
        style={[
          styles.statsContainer,
          { backgroundColor: isDark ? "#1a1a1a" : COLORS.surface },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: COLORS.primary }]}>
            {favorites.length}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#aaa" : COLORS.textSecondary },
            ]}
          >
            Favoritos
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: COLORS.primary }]}>
            {watched.length}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: isDark ? "#aaa" : COLORS.textSecondary },
            ]}
          >
            Vistos
          </Text>
        </View>
      </View>

      {/* Favoritos */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#fff" : COLORS.text },
          ]}
        >
          Tus Favoritos
        </Text>
        {renderMovieRow(favorites)}
      </View>

      {/* Vistos */}
      <View style={{ marginBottom: 16 }}>
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#fff" : COLORS.text },
          ]}
        >
          Películas Vistas
        </Text>
        {renderMovieRow(watched)}
      </View>

      {/* Botones */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? "#1a1a1a" : COLORS.surface },
        ]}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <Text style={styles.buttonText}> Administrar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? "#1a1a1a" : COLORS.surface },
        ]}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.buttonText}> Configuración de la app</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={signOut}
      >
        <Text style={[styles.buttonText, { color: "#fff" }]}>
          Cerrar Sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: "center" },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 48, color: "#fff", fontWeight: "bold" },
  userName: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  userEmail: { fontSize: 16 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  statLabel: { fontSize: 14 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 16,
  },
  emptyText: { marginLeft: 16, fontSize: 14, fontStyle: "italic" },
  poster: { width: 100, height: 150, borderRadius: 8 },
  button: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  buttonText: { fontWeight: "600" },
  logoutButton: { backgroundColor: COLORS.error, borderWidth: 0 },
});
