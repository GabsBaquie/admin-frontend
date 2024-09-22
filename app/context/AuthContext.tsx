// app/context/AuthContext.tsx
"use client";

import axiosInstance from "@/app/utils/axiosInstance";
import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      console.log("Token loaded from localStorage:", storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting to log in with:", { email, password });
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);

      // Stocke le token et le rôle dans le localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role); // Stocke le rôle

      setToken(response.data.token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      throw new Error("Identifiants invalides");
    }
  };

  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
