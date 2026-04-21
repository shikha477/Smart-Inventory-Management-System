import { createContext, useEffect, useMemo, useState } from "react";
import { getMe, loginUser, logoutUser, registerUser } from "../services/authService";

export const AuthContext = createContext(null);

const TOKEN_KEY = "sims_token";
const USER_KEY = "sims_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  const persistAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const clearAuth = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (payload) => {
    const response = await loginUser(payload);
    persistAuth(response.token, response.user);
    return response;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    persistAuth(response.token, response.user);
    return response;
  };

  const logout = async () => {
    try {
      if (token) {
        await logoutUser();
      }
    } finally {
      clearAuth();
    }
  };

  useEffect(() => {
    let isMounted = true;

    const hydrateUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getMe();
        if (isMounted) {
          setUser(response.user);
          localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        }
      } catch {
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    hydrateUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      hasRole: (roles) => {
        if (!user?.role) return false;
        return roles.includes(user.role);
      },
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
