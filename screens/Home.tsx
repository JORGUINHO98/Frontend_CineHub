import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import {
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import MovieCard from "../components/MovieCard";
import { movieService } from "../services/api";
import { RootStackParamList, MainTabParamList, Movie } from "../types";

// Tipos de navegación
type StackNav = NativeStackNavigationProp<RootStackParamList>;
type TabNav = BottomTabNavigationProp<MainTabParamList>;

export default function HomeScreen() {
  const stackNav = useNavigation<StackNav>();
  const tabNav = useNavigation<TabNav>();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [watched, setWatched] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "watched" | "pending">("all");
  const [loading, setLoading] = useState(true);

  // cargar colección (favoritos + vistos)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const favRes = await movieService.getFavorites();
        const watchedRes = await movieService.getWatched();

        // mapeamos estados
        const favs = favRes.map((m: any) => ({ ...m, status: "pending" }));
        const seen = watchedRes.map((m: any) => ({ ...m, status: "watched" }));

        setFavorites(favs);
        setWatched(seen);
      } catch (err) {
        console.error("Error cargando colección:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allMovies = [...favorites, ...watched];

  const filteredMovies =
    filter === "all"
      ? allMovies
      : allMovies.filter((m) => m.status === filter);

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

      {/* filtros */}
      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterBtn,
            filter === "all" && styles.filterBtnActive,
          ]}
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
            filter === "pending" && styles.filterBtnActive,
          ]}
          onPress={() => setFilter("pending")}
        >
          <Text style={styles.filterText}>Pendientes</Text>
        </TouchableOpacity>
      </View>

      {/* grilla */}
      <FlatList
        data={filteredMovies}
        keyExtractor={(m) => m.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            layout="grid"
            onPress={() =>
              stackNav.navigate("MovieDetail", { movieId: item.id })
            }
            overlayIcon={item.status === "watched" ? "✔️" : "🕒"}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay películas en tu colección.</Text>
        }
      />

      {/* FAB */}
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
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
