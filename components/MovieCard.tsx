// src/components/MovieCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Movie, RootStackParamList } from "../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Props = {
  movie: Movie;
  layout?: "grid" | "list";
  onPress?: () => void; // opcional
  onToggleFavorite?: (movie: Movie) => void;
  onToggleWatched?: (movie: Movie) => void;
  onRateMovie?: (movie: Movie, rating: number) => void;
};

export default function MovieCard({
  movie,
  layout = "grid",
  onPress,
  onToggleFavorite,
  onToggleWatched,
  onRateMovie,
}: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie.poster || "https://via.placeholder.com/120x180.png?text=No+Image";

  const handlePress = () => {
    if (onPress) return onPress();
    navigation.navigate("MovieDetail", { movieId: movie.id, movie } as any);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => onRateMovie && onRateMovie(movie, i + 1)}
        accessibilityLabel={`rate-${i + 1}`}
      >
        <Text style={{ marginRight: 6 }}>{i < (movie.calificacion || 0) ? "★" : "☆"}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <TouchableOpacity
      style={[styles.card, layout === "list" && styles.listCard]}
      onPress={handlePress}
    >
      <Image source={{ uri: poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onToggleFavorite?.(movie)}>
            <Text style={styles.actionBtn}>
              {movie.isFavorite ? "💖" : "🤍"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onToggleWatched?.(movie)}>
            <Text style={styles.actionBtn}>
              {movie.isWatched ? "👀" : "➕"}
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", marginLeft: 8 }}>
            {onRateMovie && renderStars()}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1c1c1c",
  },
  listCard: {
    flexDirection: "row",
    height: 120,
  },
  poster: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center",
  },
  actionBtn: {
    fontSize: 18,
    marginRight: 10,
  },
});
