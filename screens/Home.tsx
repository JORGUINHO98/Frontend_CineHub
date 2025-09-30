import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

import MovieCard from "../components/MovieCard";
import { RootStackParamList, MainTabParamList, Movie } from "../types";
import { MovieContext } from "../context/MovieContext";

type StackNav = NativeStackNavigationProp<RootStackParamList>;
type TabNav = BottomTabNavigationProp<MainTabParamList>;

export default function HomeScreen() {
  const stackNav = useNavigation<StackNav>();
  const tabNav = useNavigation<TabNav>();

  const { favorites, watched, toggleFavorite, toggleWatched, refreshMovies } =
    useContext(MovieContext);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "watched" | "favorite">("all");

  useEffect(() => {
    const build = async () => {
      setLoading(true);
      try {
        await refreshMovies();
        const byId = new Map<number | string, Movie>();
        favorites.forEach((m) => {
          byId.set(m.id, {
            ...m,
            isFavorite: true,
            isWatched: m.isWatched || false,
          });
        });
        watched.forEach((m) => {
          const existing = byId.get(m.id);
          if (existing) {
            existing.isWatched = true;
            existing.isFavorite = existing.isFavorite || false;
          } else {
            byId.set(m.id, {
              ...m,
              isWatched: true,
              isFavorite: m.isFavorite || false,
            });
          }
        });
        setMovies(Array.from(byId.values()));
      } catch (err) {
        console.error("Home build error:", err);
      } finally {
        setLoading(false);
      }
    };
    build();
  }, [favorites.length, watched.length]);

  const updateMovieState = (movie: Movie, changes: Partial<Movie>) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === movie.id ? { ...m, ...changes } : m))
    );
    setMovies((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      return [...prev, { ...movie, ...changes }];
    });
  };

  const onToggleFavorite = async (movie: Movie) => {
    try {
      await toggleFavorite(movie);
      updateMovieState(movie, { isFavorite: !movie.isFavorite });
    } catch (err) {
      console.error(err);
    }
  };

  const onToggleWatched = async (movie: Movie) => {
    try {
      await toggleWatched(movie);
      updateMovieState(movie, { isWatched: !movie.isWatched });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMovies =
    filter === "all"
      ? movies
      : movies.filter((m) =>
          filter === "watched" ? m.isWatched : m.isFavorite
        );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Colección</Text>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "all" && styles.filterBtnActive]}
          onPress={() => setFilter("all")}
        >
          <Text style={styles.filterText}>Todas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === "watched" && styles.filterBtnActive,
          ]}
          onPress={() => setFilter("watched")}
        >
          <Text style={styles.filterText}>Vistas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === "favorite" && styles.filterBtnActive,
          ]}
          onPress={() => setFilter("favorite")}
        >
          <Text style={styles.filterText}>Favoritos</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMovies}
        keyExtractor={(m) => m.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            layout="grid"
            onToggleFavorite={onToggleFavorite}
            onToggleWatched={onToggleWatched}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay películas en tu colección.</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => tabNav.navigate("Search")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#fff", marginBottom: 12 },
  filters: { flexDirection: "row", marginBottom: 16 },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: "#00ff88" },
  filterText: { color: "#fff", fontSize: 14 },
  empty: { color: "gray", textAlign: "center", marginTop: 20 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#00ff88",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: { fontSize: 28, color: "#121212", fontWeight: "bold" },
});

