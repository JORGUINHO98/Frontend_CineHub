// src/screens/MovieDetail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { movieService } from "../services/api";
import { COLORS } from "../config/config";

const { width } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const route = useRoute();
  const { movieId } = route.params as { movieId: number };

  const [movie, setMovie] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await movieService.getMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        console.error("❌ Error cargando detalle:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMovie();
  }, [movieId]);

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
      {/* Poster */}
      {movie.poster && (
        <Image source={{ uri: movie.poster }} style={styles.poster} />
      )}

      {/* Título */}
      <Text style={styles.title}>{movie.titulo}</Text>

      {/* Info rápida */}
      <Text style={styles.meta}>
        {movie.fecha_lanzamiento?.slice(0, 4)} • {movie.duracion} min
      </Text>

      {/* Géneros */}
      <Text style={styles.genres}>
        {movie.generos?.join(" • ")}
      </Text>

      {/* Descripción */}
      <Text style={styles.overview}>{movie.descripcion}</Text>

      {/* Director */}
      <Text style={styles.subTitle}>🎬 Director</Text>
      <Text style={styles.text}>{movie.director}</Text>

      {/* Actores */}
      <Text style={styles.subTitle}>👥 Actores principales</Text>
      {movie.actores?.map((actor: string, idx: number) => (
        <Text key={idx} style={styles.text}>• {actor}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
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
  text: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
});
