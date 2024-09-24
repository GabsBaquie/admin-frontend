// app/utils/fetchWithAuth.ts

import { API_BASE_URL } from "./api"; // Importer la base URL

export const fetchWithAuth = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Construire l'URL complète en réutilisant la constante API_BASE_URL
  const url = `${API_BASE_URL}/${endpoint}`;

  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("token");

  // Configurer les en-têtes
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Inclure les cookies si nécessaire (équivalent de withCredentials: true dans Axios)
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Ajoute cette ligne si votre API nécessite les cookies
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Gérer les erreurs de statut
    if (!response.ok) {
      // Tenter de parser le JSON pour obtenir le message d'erreur
      let errorMessage = "Erreur lors de la requête.";
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        // Si la réponse n'est pas JSON, lire le texte brut
        const errorText = await response.text();
        console.error("Unexpected response format:", errorText);
        errorMessage = `Unexpected response format: ${errorText}`;
      }

      throw new Error(errorMessage);
    }

    // Si la réponse est 204 No Content, ne pas tenter de parser le JSON
    if (response.status === 204) {
      return null as unknown as T;
    }

    // Parser la réponse JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("FetchWithAuth error:", error);
    throw error;
  }
};
