import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { AuthService } from "@/api/AuthService";
import { useMe } from "@/hooks/useMe";
import { authStore } from "@/stores/authStore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [token, setToken] = useState(() => {
        const t = authStore.getToken();
        if (t) {
            api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
        }
        return t;
    });

    useEffect(() => {
        const unsubscribe = authStore.subscribe((newToken) => {
            if (newToken) {
                api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            } else {
                delete api.defaults.headers.common["Authorization"];
            }
            setToken(newToken);
        });
        return unsubscribe;
    }, []);

    // In Refresh Fail Logout user
    useEffect(() => {
        const handleForceLogout = () => {
            logoutWithoutClearingToken();
        };
        window.addEventListener("auth:force-logout", handleForceLogout);
        return () => window.removeEventListener("auth:force-logout", handleForceLogout);
    }, []);

    // Get user (only token exists)
    const {
        data: user,
        isLoading,
        isError,
    } = useMe(!!token);

    // LOGIN
    const login = async (email, password) => {
        const data = await AuthService.login(email, password);
        authStore.setToken(data.access_token);
        await queryClient.invalidateQueries({ queryKey: ["me"] });
        navigate("/tasks", { replace: true });
    };

    // REGISTER
    const register = async (payload) => {
        await AuthService.register(payload);
        await login(payload.email, payload.password);
    };

    // LOGOUT
    const logout = useCallback(async () => {
        try {
            await AuthService.logout();
        } catch { }
        logoutWithoutClearingToken();
    }, []);

    const logoutWithoutClearingToken = useCallback(() => {
        authStore.setToken(null);
        queryClient.clear();
        navigate("/login", { replace: true });
    }, [navigate, queryClient]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);