let token = localStorage.getItem("access_token");
const listeners = new Set();

export const authStore = {
  getToken: () => token,
  setToken: (newToken) => {
    token = newToken;
    if (newToken) {
      localStorage.setItem("access_token", newToken);
    } else {
      localStorage.removeItem("access_token");
    }
    listeners.forEach((listener) => listener(newToken));
  },
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};