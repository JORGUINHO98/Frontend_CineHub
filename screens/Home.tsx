import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, StatusBar, Dimensions, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { movieService } from "../services/api";
import MovieCard from "../components/MovieCard";
import { COLORS } from "../config/config";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const loadPopularMovies = async () => {
    try {
      setError(null);
      console.log("Loading popular movies...");
      const movies = await movieService.getPopular();
      console.log("Movies loaded:", movies?.length || 0);
      setPopularMovies(movies || []);
    } catch (error) {
      console.error("Error loading popular movies:", error);
      setError("Error al cargar las películas. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPopularMovies();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!user) {
      navigation.navigate("Login" as never);
    } else {
      loadPopularMovies();
    }
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <Text style={styles.loadingText}>Cargando películas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPopularMovies}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <Text style={styles.title}>Películas Populares</Text>
      <FlatList
        data={popularMovies}
        renderItem={({ item }) => (
          <MovieCard movie={item} layout="grid" onPress={() => {}} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  listContainer: { paddingBottom: 20 },
  row: { justifyContent: "space-between", paddingHorizontal: 16 },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 18,
    color: COLORS.text,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
