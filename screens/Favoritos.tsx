import React, { useEffect, useState } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { api } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function FavoritosScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/favoritos/");
        setMovies(res.data);
      } catch (err) {
        console.error("Error cargando favoritos:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <FlatList
      data={movies}
      keyExtractor={(m) => m.id.toString()}
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          layout="list"                                    // 👈 obligatorio
          onPress={() => console.log("Favorito:", item.title)}
        />
      )}
      ListEmptyComponent={<Text>No tienes favoritos.</Text>}
    />
  );
}
