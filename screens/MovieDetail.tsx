
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
} from "react-native";
import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, Movie } from "../types";
import { movieService } from "../services/api";
import { COLORS } from "../config/config";
import { MovieContext } from "../context/MovieContext";

type MovieDetailRouteProp = RouteProp<RootStackParamList, "MovieDetail">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function MovieDetail() {
  const route = useRoute<MovieDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { movieId, movie: passedMovie } = route.params as any;

  const { toggleFavorite, toggleWatched, rateMovie, favorites, watched } =
    useContext(MovieContext);

  const [movie, setMovie] = useState<Movie | null>(passedMovie || null);
  const [loading, setLoading] = useState(!passedMovie);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const textColor = isDark ? "#fff" : "#000";
  const subtitleColor = isDark ? "#aaa" : "#555";

  useEffect(() => {
    if (!movie && movieId) {
      (async () => {
        try {
          const data = await movieService.getMovieDetails(movieId);
          setMovie(data);
        } catch (error) {
          console.error("Error cargando detalles de película:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: textColor }}>No se encontró la película.</Text>
      </View>
    );
  }

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.poster || "https://via.placeholder.com/300x450.png?text=No+Image";
  // Verificar si está en favoritos o vistos
  const isFavorite = favorites.some((f) => f.id === movie.id);
  const watchedMovie = watched.find((w) => w.id === movie.id);
  const userRating = watchedMovie?.calificacion;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: COLORS.background }]}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Atrás</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Image source={{ uri: poster }} style={styles.poster} />
        <Text style={[styles.title, { color: textColor }]}>{movie.title}</Text>
        <Text style={[styles.subtitle, { color: subtitleColor }]}>
          {movie.release_date?.split("-")[0] || "Sin fecha"}
        </Text>
        <Text style={[styles.overview, { color: textColor }]}>
          {movie.overview || "Sin descripción disponible."}
        </Text>

        {/* Botones de acciones */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: isFavorite ? COLORS.error : COLORS.primary },
            ]}
            onPress={() => toggleFavorite(movie)}
          >
            <Text style={styles.actionText}>
              {isFavorite ? "Quitar Favorito" : "Agregar a Favoritos"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: watchedMovie ? COLORS.error : COLORS.secondary },
            ]}
            onPress={() => toggleWatched(movie)}
          >
            <Text style={styles.actionText}>
              {watchedMovie ? "Quitar de Vistos" : "Marcar como Visto"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Calificación */}
        {watchedMovie && (
          <View style={styles.ratingContainer}>
            <Text style={[styles.subtitle, { color: textColor }]}>
              Tu Calificación:
            </Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => rateMovie(movie, star)}
                >
                  <Text
                    style={[
                      styles.star,
                      {
                        color:
                          userRating && userRating >= star ? "#FFD700" : "#777",
                      },
                    ]}
                  >
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { color: COLORS.primary, fontSize: 24, marginRight: 12 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.primary },
  content: { padding: 20, alignItems: "center" },
  poster: { width: 300, height: 450, borderRadius: 12, marginBottom: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, marginBottom: 16 },
  overview: { fontSize: 16, lineHeight: 22, textAlign: "justify" },

  actions: { flexDirection: "row", marginTop: 20, justifyContent: "center" },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  actionText: { color: "#fff", fontSize: 14, fontWeight: "bold" },

  ratingContainer: { marginTop: 20, alignItems: "center" },
  stars: { flexDirection: "row", marginTop: 8 },
  star: { fontSize: 32, marginHorizontal: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
