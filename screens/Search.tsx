// src/screens/Search.tsx
import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Platform,
} from "react-native";
import { movieService } from "../services/api";
import MovieCard from "../components/MovieCard";
import FuturisticInput from "../components/FuturisticInput";
import FuturisticButton from "../components/FuturisticButton";
import { COLORS } from "../config/config";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // === Buscar películas ===
  const searchMovies = async (searchQuery: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      if (Platform.OS !== "web") {
        alert("Por favor ingresa un término de búsqueda");
      }
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await movieService.search(searchQuery, pageNum);
      console.log("✅ Respuesta búsqueda:", response);

      const { results: movies, total_pages, page: currentPage } = response;

      if (pageNum === 1) {
        setResults(movies);
      } else {
        setResults((prev) => [...prev, ...movies]);
      }

      setTotalPages(total_pages);
      setPage(currentPage);
      setHasSearched(true);
    } catch (error: any) {
      console.error("❌ Error en búsqueda:", error.response?.data || error.message);
      setErrorMsg(
        error.response?.data?.error ||
          "No se pudo realizar la búsqueda. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setResults([]);
    searchMovies(query, 1);
  };

  const loadMore = () => {
    if (page < totalPages && !loading) {
      searchMovies(query, page + 1);
    }
  };

  const renderMovie = ({ item }: { item: any }) => (
    <MovieCard movie={item} layout="list" onPress={() => {}} />
  );

  const renderFooter = () => {
    if (loading && page > 1) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator color={COLORS.primary} size="large" />
        </View>
      );
    }

    if (page < totalPages && hasSearched && !loading) {
      return (
        <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
          <Text style={styles.loadMoreText}>Cargar más películas</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  const renderEmpty = () => {
    if (errorMsg) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>⚠️</Text>
          <Text style={styles.emptyTitle}>Error en la búsqueda</Text>
          <Text style={styles.emptySubtitle}>{errorMsg}</Text>
        </View>
      );
    }

    if (!hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Busca tus películas favoritas</Text>
          <Text style={styles.emptySubtitle}>
            Ingresa el nombre de una película para comenzar
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>😔</Text>
        <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
        <Text style={styles.emptySubtitle}>
          Intenta con otro término de búsqueda
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header fijo con Input + Botón */}
      <View style={styles.header}>
        <FuturisticInput
          label="Buscar películas"
          placeholder="Escribe el nombre de la película..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        <FuturisticButton
          title="Buscar"
          onPress={handleSearch}
          loading={loading}
          size="large"
          style={styles.searchButton}
        />
      </View>

      {/* Lista de resultados */}
      <FlatList
        data={results}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
  },
  searchInput: {
    marginBottom: 16,
  },
  searchButton: {
    marginBottom: 8,
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: "center" as const,
  },
  loadMoreButton: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center" as const,
  },
  loadMoreText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600" as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center" as const,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center" as const,
    lineHeight: 20,
  },
};
