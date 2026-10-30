import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/api/client";
import { AuthService } from "@/api/AuthService";
import { useMe } from "@/hooks/useMe";
import { authStore } from "@/stores/authStore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const locationRef = useRef(location);
    locationRef.current = location;

    const [token, setToken] = useState(() => {
        const t = authStore.getToken();
        if (t) {
            api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
        }
        return t;
    });

    const clearSession = useCallback(() => {
        authStore.setToken(null);
        delete api.defaults.headers.common["Authorization"];
        queryClient.clear();

        const path = locationRef.current.pathname;
        if (path !== "/login" && path !== "/register") {
            navigate("/login", { replace: true });
        }
    }, [navigate, queryClient]);

    const clearSessionRef = useRef(clearSession);
    clearSessionRef.current = clearSession;

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

    // Refresh failed, or the access token was rejected and could not be renewed.
    useEffect(() => {
        const handleForceLogout = () => {
            clearSessionRef.current();
        };
        window.addEventListener("auth:force-logout", handleForceLogout);
        return () => window.removeEventListener("auth:force-logout", handleForceLogout);
    }, []);

    // Get user (only token exists)
    const {
        data: user,
        isLoading,
        isError,
        error,
    } = useMe(!!token);

    const isUnauthorized = Boolean(
        token && isError && error?.response?.status === 401
    );

    useEffect(() => {
        if (!isUnauthorized) return;
        clearSession();
    }, [isUnauthorized, clearSession]);

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
        } catch {
            // Session is already invalid; local state is cleared below.
        }
        clearSession();
    }, [clearSession]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading: Boolean(isLoading && !isUnauthorized),
                isUnauthorized,
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