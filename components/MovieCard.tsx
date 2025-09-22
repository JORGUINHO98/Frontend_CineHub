import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Movie } from "types";   

type Props = {
  movie: Movie;
  layout?: "grid" | "list";   // opcional
  onPress?: () => void;       // opcional
};

export default function MovieCard({
  movie,
  layout = "grid",
  onPress = () => {},
}: Props) {
  // Validar poster (puede venir null)
  const poster = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : movie?.poster || null;

  // Placeholder online
  const posterSource = poster
    ? { uri: poster }
    : { uri: "https://via.placeholder.com/120x180.png?text=No+Image" };

  return (
    <TouchableOpacity
      style={layout === "grid" ? styles.gridCard : styles.listCard}
      onPress={onPress}
    >
      {layout === "grid" ? (
        <>
          <Image source={posterSource} style={styles.gridImage} />
          <Text numberOfLines={2} style={styles.gridTitle}>
            {movie.title}
          </Text>
        </>
      ) : (
        <>
          <Image source={posterSource} style={styles.listImage} />
          <View style={styles.listContent}>
            <Text numberOfLines={2} style={styles.listTitle}>
              {movie.title}
            </Text>
            <Text style={styles.listSubtitle}>
              {movie.release_date?.split("-")[0] || "Sin fecha"}
            </Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gridCard: {
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  gridImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  gridTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  listCard: {
    flexDirection: "row",
    marginVertical: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    overflow: "hidden",
  },
  listImage: {
    width: 100,
    height: 150,
  },
  listContent: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  listSubtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
});
