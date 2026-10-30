import axios from "axios";
import { authStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: window.RUNTIME_ENV?.API_URL || import.meta.env.VITE_API_URL || "/api/v1",
  timeout: 20000,
  withCredentials: true,
});

// Init token in start
const token = authStore.getToken();
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// =====================
// REFRESH STATE
// =====================
let isRefreshing = false;
let queue = [];

const processQueue = (error, newToken = null) => {
  queue.forEach(({ resolve, reject }) => {
    if (newToken) resolve(newToken);
    else reject(error);
  });
  queue = [];
};

const forceLogout = () => {
  authStore.setToken(null);
  delete api.defaults.headers.common["Authorization"];
  window.dispatchEvent(new CustomEvent("auth:force-logout"));
};

const isAuthEndpoint = (url = "") =>
  url.includes("/auth/login") ||
  url.includes("/auth/register") ||
  url.includes("/auth/refresh_token");

// =====================
// INTERCEPTOR
// =====================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!error.response || !original) {
      return Promise.reject(error);
    }

    const url = String(original.url || "");

    // Login/register errors stay on the form. Refresh failures are handled
    // by the request that started the refresh, so they must not refresh again.
    if (original._skipAuthRefresh || isAuthEndpoint(url)) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Access token is already gone, or this request was already retried.
    if (!authStore.getToken() || original._retry) {
      forceLogout();
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh_token", null, {
        _skipAuthRefresh: true,
      });
      const newToken = data?.access_token;

      if (!newToken) {
        throw new Error("Refresh did not return an access token");
      }

      authStore.setToken(newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      processQueue(null, newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (err) {
      processQueue(err, null);
      forceLogout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;