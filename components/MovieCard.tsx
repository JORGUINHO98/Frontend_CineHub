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
  layout?: "grid" | "list";   
  onPress?: () => void;       
  overlayIcon?: string;
};

export default function MovieCard({
  movie,
  layout = "grid",
  onPress = () => {},
  overlayIcon,
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
        <View>
          <Image source={posterSource} style={styles.gridImage} />
          {overlayIcon && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>{overlayIcon}</Text>
            </View>
          )}
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.gridTitle}>
            {movie.title}
          </Text>
          {movie.release_date && (
            <Text style={styles.gridSubtitle}>
              {movie.release_date.split("-")[0]}
            </Text>
          )}
        </View>
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
    margin: 6,
    alignItems: "center",
    width: 130,
  },
  gridImage: {
    width: 120,
    height: 180,
    borderRadius: 10,
    marginBottom: 6,
  },
  overlay: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  overlayText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 12,
    color: "#aaa",
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
    lineHeight: 20,
  },
  listSubtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
});
