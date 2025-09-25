import axios, { AxiosResponse, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, APP_CONFIG } from "../config/config";

// Cache en memoria
const cache = new Map<string, { data: any; timestamp: number }>();

export const api = axios.create({
  baseURL: API_URL,
  timeout: APP_CONFIG.apiTimeout,
  headers: { "Content-Type": "application/json" },
});

// ===== Helpers =====
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

// ===== Servicios =====
export const movieService = {
  async getPopular() {
    const response = await api.get("/tmdb/populares/");
    return response.data;
  },

  async getEstrenos() {
    const response = await api.get("/tmdb/estrenos/");
    return response.data;
  },

  async search(query: string, page: number = 1) {
    const response = await api.get(`/tmdb/buscar/?q=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  },

  async getMovieDetails(movieId: number) {
    const response = await api.get(`/tmdb/detalle/${movieId}/`);
    return response.data;
  },

  // --- Favoritos ---
  async getFavorites() {
    const response = await api.get("/favoritos/");
    return response.data;
  },
  async addToFavorites(movieData: any) {
    const response = await api.post("/favoritos/", movieData);
    return response.data;
  },
  async removeFromFavorites(favId: number) {
    const response = await api.delete(`/favoritos/${favId}/`);
    return response.data;
  },

  // --- Vistos ---
  async getWatched() {
    const response = await api.get("/vistos/");
    return response.data;
  },
  async addToWatched(movieData: any) {
    const response = await api.post("/vistos/", movieData);
    return response.data;
  },
  async removeFromWatched(vistoId: number) {
    const response = await api.delete(`/vistos/${vistoId}/`);
    return response.data;
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
