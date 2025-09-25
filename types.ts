// src/types.ts

// 🎬 Película
export type Movie = {
  id: number;
  title: string;
  poster_path?: string | null;
  poster?: string | null;
  release_date?: string | null;
  overview?: string | null;
  vote_average?: number;
  genre_ids?: number[];
};

// 👤 Usuario básico
export type User = {
  id: number;
  email: string;
  nombre: string;
  pais: string;
  telefono?: string;
};

// 👤 Usuario extendido (ej: perfil completo desde backend)
export type ExtendedUser = User & {
  avatar?: string;
  fecha_registro: string;
  suscripcion_activa?: any;
};

// 🔑 Respuesta de autenticación
export type AuthResponse = {
  access: string;
  refresh: string;
  user: User;
};

// ⭐ Favorito
export type Favorite = {
  id: number;
  movie: Movie;
  user: User;
};

// 👀 Visto
export type Watched = {
  id: number;
  movie: Movie;
  user: User;
  watched_at: string;
};

// 🔍 Búsqueda
export type SearchResult = {
  results: Movie[];
  total_results: number;
  total_pages: number;
};
// 📱 Navegación principal
export type RootStackParamList = {
  MainTabs: undefined;
  MovieDetail: { movieId: number }; // detalle de película recibe un id
};


// 📂 Tabs inferiores
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

