// app/context/AuthContext.tsx
"use client";

import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface DecodedToken {
  exp: number;
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

  // Fonction pour vérifier si le token est expiré
  const checkTokenValidity = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000; // Convertir en secondes
      return decodedToken.exp > currentTime; // Retourne true si le token est valide
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  // useEffect pour charger le token au premier rendu et vérifier sa validité
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && checkTokenValidity(storedToken)) {
      setToken(storedToken);
      // console.log("Token loaded from localStorage:", storedToken);
    } else {
      console.log("Token invalid or expired, removing token.");
      localStorage.removeItem("token"); // Supprime le token si invalide ou expiré
      localStorage.removeItem("role");
    }
    setLoading(false); // Assurez-vous de définir "loading" à false après l'initialisation
  }, []);

  // Fonction login, ajoutée dans un useCallback pour éviter les re-render inutiles
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"}/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Erreur lors de la connexion.");
        }

        // Stocke le token et le rôle dans le localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        setToken(data.token); // Met à jour l'état avec le nouveau token
        router.push("/dashboard"); // Redirige vers le dashboard après connexion réussie
      } catch (err) {
        console.error("Login error:", err);
        throw new Error(err.message || "Identifiants invalides");
      }
    },
    [router]
  );

  // Fonction logout, également encapsulée dans un useCallback
  const logout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Supprime également le rôle du localStorage
    setToken(null); // Réinitialise l'état du token
    router.push("/login"); // Redirige vers la page de login après déconnexion
  }, [router]);

  // Ne rend pas les enfants tant que l'état "loading" n'est pas faux
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
