import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import MovieCard from "../components/MovieCard";
import { movieService } from "../services/api";
import { RootStackParamList, Movie, SearchResult } from "../types";
import { MovieContext } from "../context/MovieContext";

export default function SearchScreen() {
  const { favorites, watched, toggleFavorite, toggleWatched, refreshMovies } =
    useContext(MovieContext);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [estrenos, setEstrenos] = useState<Movie[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [pop, upc] = await Promise.all([
          movieService.getPopular(),
          movieService.getEstrenos(),
        ]);
        setPopular(pop);
        setEstrenos(upc);
        await refreshMovies();
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    const favIds = new Set(favorites.map((m) => m.id));
    const wIds = new Set(watched.map((m) => m.id));
    setResults((prev) =>
      prev.map((m) => ({
        ...m,
        isFavorite: favIds.has(m.id),
        isWatched: wIds.has(m.id),
      }))
    );
  }, [favorites.length, watched.length]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res: SearchResult = await movieService.search(query);
      const favIds = new Set(favorites.map((m) => m.id));
      const wIds = new Set(watched.map((m) => m.id));
      const moviesWithFlags = res.results.map((m) => ({
        ...m,
        isFavorite: favIds.has(m.id),
        isWatched: wIds.has(m.id),
      }));
      setResults(moviesWithFlags);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateMovieState = (movie: Movie, changes: Partial<Movie>) => {
    setResults((prev) =>
      prev.map((m) => (m.id === movie.id ? { ...m, ...changes } : m))
    );
  };

  const handleToggleFavorite = async (movie: Movie) => {
    try {
      await toggleFavorite(movie);
      updateMovieState(movie, { isFavorite: !movie.isFavorite });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWatched = async (movie: Movie) => {
    try {
      await toggleWatched(movie);
      updateMovieState(movie, { isWatched: !movie.isWatched });
    } catch (err) {
      console.error(err);
    }
  };

  const renderHorizontal = (title: string, data: Movie[]) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data.map((m) => ({
          ...m,
          isFavorite: favorites.some((f) => f.id === m.id),
          isWatched: watched.some((w) => w.id === m.id),
        }))}
        horizontal
        keyExtractor={(m) => m.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            layout="grid"
            onToggleFavorite={handleToggleFavorite}
            onToggleWatched={handleToggleWatched}
          />
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Películas</Text>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Buscar..."
          placeholderTextColor="#aaa"
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#00ff88" />}

      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(m) => m.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              layout="grid"
              onToggleFavorite={handleToggleFavorite}
              onToggleWatched={handleToggleWatched}
            />
          )}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {renderHorizontal("Populares", popular)}
          {renderHorizontal("Próximos Estrenos", estrenos)}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  title: { fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 12 },
  searchBar: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    backgroundColor: "#333",
    color: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchBtn: {
    backgroundColor: "#00ff88",
    marginLeft: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtnText: { fontSize: 18 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
});
