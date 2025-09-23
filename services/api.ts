// services/api.ts
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

// ===== Interceptor con refresh token =====
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = await AsyncStorage.getItem("@cinehub_refresh");
        if (!refresh) throw new Error("No refresh token found");

        const { access } = await authService.refreshToken(refresh);
        await AsyncStorage.setItem("@cinehub_access", access);
        setAuthToken(access);

        processQueue(null, access);

        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await AsyncStorage.multiRemove(["@cinehub_access", "@cinehub_refresh"]);
        setAuthToken();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ===== Servicios =====
export const movieService = {
  async getPopular() {
    const cacheKey = "popular_movies";
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const response = await api.get("/tmdb/populares/");
    setCachedData(cacheKey, response.data);
    return response.data;
  },

  async getEstrenos() {
    const cacheKey = "estrenos_movies";
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const response = await api.get("/tmdb/estrenos/");
    setCachedData(cacheKey, response.data);
    return response.data;
  },

  async search(query: string, page: number = 1) {
  const cacheKey = `search_${query}_${page}`;
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  const response = await api.get(
    `/tmdb/buscar/?q=${encodeURIComponent(query)}&page=${page}`
  );

  setCachedData(cacheKey, response.data); // 👈 guardamos todo el objeto
  return response.data; // 👈 devolvemos todo el objeto
},
async getMovieDetails(movieId: number) {
  const response = await api.get(`/tmdb/detalle/${movieId}/`);
  return response.data;
},

  async getFavorites() {
    const response = await api.get("/favoritos/");
    return response.data;
  },

  async addToFavorites(tmdbId: number) {
    const response = await api.post("/favoritos/", { tmdb_id: tmdbId });
    return response.data;
  },

  async removeFromFavorites(favId: number) {
    const response = await api.delete(`/favoritos/${favId}/`);
    return response.data;
  },

  async getWatched() {
    const response = await api.get("/vistos/");
    return response.data;
  },

  async addToWatched(movieData: any) {
    const response = await api.post("/vistos/", movieData);
    return response.data;
  },
};

export const authService = {
  // 👇 Aquí cambiamos a /auth/login-jwt/ que es el que devuelve tokens
  async login(email: string, password: string) {
    const response = await api.post("/auth/login-jwt/", { email, password });
    return response.data; // { access, refresh }
  },

  async register(userData: { email: string; nombre: string; password: string }) {
  console.log("👉 Enviando a backend:", userData); // 👈 log para confirmar
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
