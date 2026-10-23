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

// =====================
// INTERCEPTOR
// =====================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Dont send to auth endpoints (instead /auth/me)
    if (
      original.url?.includes("/auth/login") ||
      original.url?.includes("/auth/register") ||
      original.url?.includes("/auth/refresh_token")
    ) {
      return Promise.reject(error);
    }

    // If status 401 try update token
    if (error.response.status === 401 && !original._retry) {

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
        const { data } = await api.post("/auth/refresh_token");
        const newToken = data.access_token;

        authStore.setToken(newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        processQueue(err, null);

        authStore.setToken(null);
        delete api.defaults.headers.common["Authorization"];

        window.dispatchEvent(new CustomEvent("auth:force-logout"));

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;