// app/context/AuthContext.tsx

import { useRouter } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";

interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface DecodedToken {
  exp: number;
}

interface LoginResponse {
  token: string;
  user: {
    role: string;
  };
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
      console.log("Token loaded from localStorage:", storedToken);
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
        const response = await fetchWithAuth<LoginResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        // Stocke le token et le rôle dans le localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.user.role);

        setToken(response.token); // Met à jour l'état avec le nouveau token
        router.push("/dashboard"); // Redirige vers le dashboard après connexion réussie
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
