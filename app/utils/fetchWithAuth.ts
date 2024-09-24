// app/utils/fetchWithAuth.ts

import { API_BASE_URL } from "./api"; // Importer la base URL
import jwtDecode from "jwt-decode"; // Import par défaut pour version 3.x

interface DecodedToken {
  exp: number;
}

export const fetchWithAuth = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true // Indique si la requête nécessite une authentification
): Promise<T> => {
  const url = `${API_BASE_URL}/${endpoint}`;

  let token: string | null = null;

  if (requireAuth) {
    // Récupérer le token depuis le localStorage
    token = localStorage.getItem("token");

    // Log pour vérifier si le token est bien récupéré
    console.log("Token utilisé dans fetchWithAuth:", token);

    if (!token) {
      console.error("Token manquant. Redirection vers la page de connexion.");
      throw new Error("Non autorisé - Token manquant");
    }

    // Vérifier si le token est expiré
    const checkTokenValidity = (token: string): boolean => {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000; // Convertir en secondes
        return decodedToken.exp > currentTime; // Retourne true si le token est encore valide
      } catch (error) {
        console.error("Erreur lors de la vérification du token :", error);
        return false;
      }
    };

    if (!checkTokenValidity(token)) {
      console.error("Token expiré. Redirection vers la page de connexion.");
      localStorage.removeItem("token"); // Supprimer le token expiré
      throw new Error("Non autorisé - Token expiré");
    }
  }

  // Configurer les en-têtes
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Inclure les cookies si nécessaire
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Ajoute cette ligne si votre API nécessite les cookies
  };

  try {
    console.log(`Request URL: ${url}`); // Log de l'URL utilisée
    console.log(`Request Headers:`, headers); // Log des en-têtes
    console.log(`Request Options:`, fetchOptions); // Log des options

    const response = await fetch(url, fetchOptions);

    // Gérer les erreurs de statut
    if (!response.ok) {
      let errorMessage = "Erreur lors de la requête.";
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        console.error("Unexpected response format:", errorText);
        errorMessage = `Unexpected response format: ${errorText}`;
      }

      if (response.status === 401 && requireAuth) {
        console.error("Non autorisé - Token invalide ou expiré.");
        throw new Error("Non autorisé - Token invalide ou expiré");
      }

      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return null as unknown as T;
    }

    const data = await response.json();
    console.log("Response Data:", data); // Log de la réponse
    return data as T;
  } catch (error) {
    console.error("FetchWithAuth error:", error);
    throw error;
  }
};
