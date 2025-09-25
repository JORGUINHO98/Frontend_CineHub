import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import MovieCard from "../components/MovieCard";
import { movieService } from "../services/api";
import { RootStackParamList, Movie, SearchResult } from "../types";

// Navegación tipada para el stack
type StackNav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const stackNav = useNavigation<StackNav>();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [estrenos, setEstrenos] = useState<Movie[]>([]);

  // cargar populares y estrenos al iniciar
  useEffect(() => {
    (async () => {
      try {
        const pop = await movieService.getPopular();
        const upc = await movieService.getEstrenos();

        // estos endpoints ya devuelven arrays planos
        setPopular(pop);
        setEstrenos(upc);
      } catch (err) {
        console.error("❌ Error cargando descubrimiento:", err);
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setLoading(true);
      const res: SearchResult = await movieService.search(query);
      setResults(res.results); // 👈 ya sabemos que siempre devuelve { results }
    } catch (err) {
      console.error("❌ Error en búsqueda:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderHorizontal = (title: string, data: Movie[]) => (
    <View style={{ marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(m) => m.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            layout="grid"
            onPress={() =>
              stackNav.navigate("MovieDetail", { movieId: item.id })
            }
          />
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Películas</Text>

      {/* barra de búsqueda */}
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

      {/* resultados */}
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
              onPress={() =>
                stackNav.navigate("MovieDetail", { movieId: item.id })
              }
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
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: "row",
    marginBottom: 16,
  },
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
