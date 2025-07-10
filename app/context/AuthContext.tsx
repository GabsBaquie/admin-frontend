// app/context/AuthContext.tsx

import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import jwtDecode from "jwt-decode"; // Import par défaut
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

  // Fonction pour vérifier si le token est expiré
  const checkTokenValidity = (token: string): boolean => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000; // Convertir en secondes
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

  // useEffect pour charger le token au premier rendu et vérifier sa validité
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && checkTokenValidity(storedToken)) {
      setToken(storedToken);
      console.log("Token loaded from localStorage:", storedToken); // Affiche le token dans la console
    } else {
      console.log("Token invalid or expired, removing token.");
      localStorage.removeItem("token"); // Supprime le token si invalide ou expiré
      localStorage.removeItem("role");
      if (storedToken) {
        router.push("/login"); // Redirige seulement si un token était présent mais invalide
      }
    }
    setLoading(false); // Assurez-vous de définir "loading" à false après l'initialisation
  }, [router]);

  // Fonction login, ajoutée dans un useCallback pour éviter les re-render inutiles
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
          false // Passe false pour ne pas exiger de token
        );

        // Stocke le token et le rôle dans le localStorage
        localStorage.setItem("token", response.token);
        localStorage.setItem("role", response.user.role);

        console.log("Token after login:", response.token); // Log le token pour vérifier qu'il est bien stocké

        setToken(response.token); // Met à jour l'état avec le nouveau token
        setUserRole(response.user.role); // Met à jour le rôle
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
    setUserRole(null); // Réinitialise le rôle
    router.push("/login"); // Redirige vers la page de login après déconnexion
  }, [router]);

  // Ne rend pas les enfants tant que l'état "loading" n'est pas faux
  return (
    <AuthContext.Provider value={{ token, userRole, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
