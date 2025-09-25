import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { movieService } from "../services/api";
import { COLORS } from "../config/config";
import { RootStackParamList } from "../types";

type MovieDetailRouteProp = RouteProp<RootStackParamList, "MovieDetail">;

const { width } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const route = useRoute<MovieDetailRouteProp>();
  const { movieId } = route.params;

  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await movieService.getMovieDetails(movieId);
        setMovie(data);

        // verificamos si ya está en favoritos o vistos
        const favs = await movieService.getFavorites();
        const seen = await movieService.getWatched();

        setIsFavorite(favs.some((f: any) => f.id === movieId));
        setIsWatched(seen.some((v: any) => v.id === movieId));
      } catch (error) {
        console.error("❌ Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMovie();
  }, [movieId]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await movieService.removeFromFavorites(movieId);
        setIsFavorite(false);
      } else {
        await movieService.addToFavorites(movieId);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error al cambiar favorito:", err);
    }
  };

  const toggleWatched = async () => {
    try {
      if (isWatched) {
        // aquí podrías hacer un remove si lo implementas en backend
        setIsWatched(false);
      } else {
        await movieService.addToWatched({ tmdb_id: movieId });
        setIsWatched(true);
      }
    } catch (err) {
      console.error("Error al cambiar visto:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.text }}>Cargando detalle...</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={{ color: COLORS.error }}>No se pudo cargar la película</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.poster && (
        <Image source={{ uri: movie.poster }} style={styles.poster} />
      )}

      <Text style={styles.title}>{movie.titulo}</Text>

      <Text style={styles.meta}>
        {movie.fecha_lanzamiento?.slice(0, 4)} • {movie.duracion} min
      </Text>

      <Text style={styles.genres}>{movie.generos?.join(" • ")}</Text>

      <Text style={styles.overview}>{movie.descripcion}</Text>

      <Text style={styles.subTitle}>🎬 Director</Text>
      <Text style={styles.text}>{movie.director}</Text>

      <Text style={styles.subTitle}>👥 Actores principales</Text>
      {movie.actores?.map((actor: string, idx: number) => (
        <Text key={idx} style={styles.text}>
          • {actor}
        </Text>
      ))}

      {/* Botones de acción */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, isFavorite && styles.buttonActive]}
          onPress={toggleFavorite}
        >
          <Text style={styles.buttonText}>
            {isFavorite ? "⭐ Quitar de Favoritos" : "⭐ Agregar a Favoritos"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isWatched && styles.buttonActive]}
          onPress={toggleWatched}
        >
          <Text style={styles.buttonText}>
            {isWatched ? "👁️ Marcada como Vista" : "👁️ Marcar como Vista"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  poster: {
    width: width * 0.9,
    height: width * 1.3,
    alignSelf: "center",
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginBottom: 8,
  },
  genres: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 16,
  },
  overview: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 10,
  },
  text: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 4 },
  actions: { marginTop: 20 },
  button: {
    backgroundColor: COLORS.surface,
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonActive: { backgroundColor: COLORS.primary },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
