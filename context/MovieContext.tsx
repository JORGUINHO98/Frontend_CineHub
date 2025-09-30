// src/context/MovieContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { Movie } from "../types";
import { movieService } from "../services/api";

type MovieContextType = {
  favorites: Movie[];
  watched: Movie[];
  loading: boolean;
  refreshMovies: () => Promise<void>;
  toggleFavorite: (movie: Movie) => Promise<void>;
  toggleWatched: (movie: Movie) => Promise<void>;
  rateMovie: (movie: Movie, rating: number) => Promise<void>;
};

export const MovieContext = createContext<MovieContextType>({
  favorites: [],
  watched: [],
  loading: false,
  refreshMovies: async () => {},
  toggleFavorite: async () => {},
  toggleWatched: async () => {},
  rateMovie: async () => {},
});

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [watched, setWatched] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Traer datos desde el backend
  const refreshMovies = async () => {
    setLoading(true);
    try {
      const [favRes, watchedRes] = await Promise.all([
        movieService.getFavorites(),
        movieService.getWatched(),
      ]);
      setFavorites(favRes || []);
      setWatched(watchedRes || []);
    } catch (err) {
      console.error("❌ Error al refrescar favoritos/vistos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMovies();
  }, []);

  // ⭐ Favoritos
  const toggleFavorite = async (movie: Movie) => {
    try {
      if (movie.favoriteId) {
        await movieService.removeFromFavorites(movie.favoriteId);
        setFavorites((prev) => prev.filter((m) => m.favoriteId !== movie.favoriteId));
      } else {
        const created = await movieService.addToFavorites({
          tmdb_id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        });
        setFavorites((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error("❌ Error en toggleFavorite:", err);
    }
  };

  // 👀 Vistos
  const toggleWatched = async (movie: Movie) => {
    try {
      if (movie.vistoId) {
        await movieService.removeFromWatched(movie.vistoId);
        setWatched((prev) => prev.filter((m) => m.vistoId !== movie.vistoId));
      } else {
        const created = await movieService.addToWatched({
          tmdb_id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        });
        setWatched((prev) => [...prev, created]);
      }
    } catch (err) {
      console.error("❌ Error en toggleWatched:", err);
    }
  };

  // ⭐ Calificación de una película vista
  const rateMovie = async (movie: Movie, rating: number) => {
    try {
      if (movie.vistoId) {
        const updated = await movieService.updateWatchedRating(movie.vistoId, rating);
        setWatched((prev) =>
          prev.map((m) =>
            m.vistoId === updated.vistoId ? { ...m, calificacion: updated.calificacion } : m
          )
        );
      } else {
        const created = await movieService.addToWatched({
          tmdb_id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
        });
        const updated = await movieService.updateWatchedRating(created.vistoId!, rating);
        setWatched((prev) => [...prev, updated]);
      }
    } catch (err) {
      console.error("❌ Error en rateMovie:", err);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        favorites,
        watched,
        loading,
        refreshMovies,
        toggleFavorite,
        toggleWatched,
        rateMovie,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
