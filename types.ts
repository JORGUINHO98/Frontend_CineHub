export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabParamList } | undefined;
  MovieDetail: { movieId: number; movie?: Movie } ;
  EditProfile: undefined;
  Settings: undefined;
  Login?: undefined;
  Register?: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

// Movie: ahora incluye meta info del usuario
export type Movie = {
  id: number;
  title: string;
  poster_path?: string | null;
  poster?: string | null;
  release_date?: string | null;
  overview?: string | null;
  vote_average?: number;
  genre_ids?: number[];
  userRating?: number;
  isFavorite?: boolean;
  isWatched?: boolean;

  favoriteId?: number; // pk del Favorito en backend
  vistoId?: number;    // pk del Visto en backend
  calificacion?: number | null;
};

export type User = {
  id: number;
  email: string;
  nombre: string;
  pais?: string;
  telefono?: string;
};

export type ExtendedUser = User & {
  avatar?: string;
  fecha_registro?: string;
  suscripcion_activa?: any;
};

export type AuthResponse = {
  access: string;
  refresh: string;
  user: User;
};

export type Favorite = {
  id: number;
  movie: Movie;
  user: User;
};

export type Watched = {
  id: number;
  movie: Movie;
  user: User;
  calificacion?: number | null;
  watched_at?: string;
};

export type SearchResult = {
  results: Movie[];
  total_results: number;
  total_pages: number;
};
