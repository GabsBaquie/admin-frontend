"use client";

import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

interface AuthContextProps {
  token: string | null;
  userRole: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface DecodedToken {
  exp: number;
  role: string;
  userId: number;
  username: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: {
    role: string;
  };
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  userRole: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkTokenValidity = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        setUserRole(decodedToken.role);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && checkTokenValidity(storedToken)) {
      setToken(storedToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      if (storedToken) {
        router.push("/login");
      }
    }
    setLoading(false);
  }, [router]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetchWithAuth<LoginResponse>(
          "auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          },
          false
        );

        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.user.role);

        setToken(response.token);
        setUserRole(response.user.role);
        router.push("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        if (err instanceof Error) {
          throw new Error(err.message || "Identifiants invalides");
        } else {
          throw new Error("Une erreur inconnue s'est produite.");
        }
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setUserRole(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
