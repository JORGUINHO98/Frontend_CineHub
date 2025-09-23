// Home.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { movieService } from "../services/api";
import MovieCard from "../components/MovieCard";
import { COLORS } from "../config/config";

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [estrenosMovies, setEstrenosMovies] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  const loadMovies = async () => {
    try {
      setError(null);
      setLoading(true);
      const [popular, estrenos] = await Promise.all([
        movieService.getPopular(),
        // Si aún no implementaste getEstrenos en api.ts, coméntalo o impleméntalo antes
        movieService.getEstrenos ? movieService.getEstrenos() : Promise.resolve([]),
      ]);
      setPopularMovies(popular || []);
      setEstrenosMovies(estrenos || []);
    } catch (err) {
      console.error("Error loading movies:", err);
      setError("Error al cargar películas. Revisa la conexión.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMovies();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!user) {
      // si no hay usuario, ir a Login (esto puede ser redundante si tu navegación ya lo maneja)
      // navigation.navigate("Login" as never);
      setLoading(false);
      return;
    }
    loadMovies();
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ color: COLORS.text, marginTop: 12 }}>Cargando películas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: COLORS.error }}>{error}</Text>
      </View>
    );
  }

  const renderSection = (title: string, data: any[]) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => { /* navega a detalle */ }} />
        )}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {renderSection("🎬 Populares", popularMovies)}
      {renderSection("🔥 Estrenos", estrenosMovies)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  section: { marginVertical: 12 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 12,
  },
});
