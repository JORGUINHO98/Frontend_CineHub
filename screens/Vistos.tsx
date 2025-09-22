import React, { useEffect, useState } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { api } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function VistosScreen() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/vistos/");
        setMovies(res.data);
      } catch (err) {
        console.error("Error cargando vistos:", err);
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
          layout="list"                                // 👈 obligatorio
          onPress={() => console.log("Visto:", item.title)} // 👈 manejador simple
        />
      )}
      ListEmptyComponent={<Text>No has visto películas aún.</Text>}
    />
  );
}
