import api from "./client";

export const AuthService = {
    login: async (email, password) => {
        const form = new FormData();
        form.append("username", email);
        form.append("password", password);

        const { data } = await api.post("/auth/login", form);
        return data;
    },

    register: async (payload) => {
        await api.post("/auth/register", payload);
    },

    me: async () => {
        const { data } = await api.get("/auth/me");
        return data;
    },

    refresh: async () => {
        const { data } = await api.post("/auth/refresh_token");
        return data;
    },

    logout: async () => {
        await api.post("/auth/logout");
    }
};