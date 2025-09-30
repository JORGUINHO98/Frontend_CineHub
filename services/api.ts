// src/services/api.ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, APP_CONFIG } from "../config/config";
import { Movie } from "../types";

const cache = new Map<string, { data: any; timestamp: number }>();

export const api = axios.create({
  baseURL: API_URL,
  timeout: APP_CONFIG.apiTimeout,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

async function getCachedData(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < APP_CONFIG.cacheTimeout) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}
function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export const movieService = {
  async getPopular() {
    const response = await api.get("/tmdb/populares/");
    return response.data as Movie[];
  },

  async getEstrenos() {
    const response = await api.get("/tmdb/estrenos/");
    return response.data as Movie[];
  },

  async search(query: string, page: number = 1) {
    const response = await api.get(`/tmdb/buscar/?q=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  },

  async getMovieDetails(movieId: number) {
    const response = await api.get(`/tmdb/detalle/${movieId}/`);
    return response.data;
  },

  // Favoritos (backend devuelve [{ id, movie }])
  async getFavorites() {
    const res = await api.get("/favoritos/");
    return (res.data || []).map((f: any) => {
      const m = f.movie || {};
      return { ...m, favoriteId: f.id } as Movie;
    });
  },
  async addToFavorites(movieData: any) {
    const res = await api.post("/favoritos/", movieData);
    // backend devuelve { id, movie }
    const data = res.data;
    return { ...data.movie, favoriteId: data.id } as Movie;
  },
  async removeFromFavorites(favId: number) {
    const res = await api.delete(`/favoritos/${favId}/`);
    return res.data;
  },

  // Vistos (backend devuelve [{ id, movie, calificacion }])
  async getWatched() {
    const res = await api.get("/vistos/");
    return (res.data || []).map((v: any) => {
      const m = v.movie || {};
      return { ...m, vistoId: v.id, calificacion: v.calificacion } as Movie;
    });
  },
  async addToWatched(movieData: any) {
    const res = await api.post("/vistos/", movieData);
    const data = res.data;
    return { ...data.movie, vistoId: data.id } as Movie;
  },
  async removeFromWatched(vistoId: number) {
    const res = await api.delete(`/vistos/${vistoId}/`);
    return res.data;
  },

  // actualizar calificación de un visto (PUT /vistos/<id>/)
  async updateWatchedRating(vistoId: number, calificacion: number) {
    const res = await api.put(`/vistos/${vistoId}/`, { calificacion });
    const data = res.data;
    return { ...data.movie, vistoId: data.id, calificacion: data.calificacion } as Movie;
  },
};

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/auth/login-jwt/", { email, password });
    return response.data;
  },

  async register(userData: { email: string; nombre: string; password: string }) {
    const response = await api.post("/auth/register/", userData);
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/auth/profile/");
    return response.data;
  },

  async updateProfile(userData: any) {
    const response = await api.put("/profile/update/", userData);
    return response.data;
  },

  async refreshToken(refresh: string) {
    const response = await api.post("/auth/token/refresh/", { refresh });
    return response.data;
  },
};
