// app/utils/fetchWithAuth.ts

import jwtDecode from "jwt-decode"; // Import par défaut pour version 3.x
import { API_BASE_URL } from "./api"; // Importer la base URL

interface DecodedToken {
  exp: number;
}

export const fetchWithAuth = async <T>(
  endpoint: string,
  options: RequestInit = {},
  requireAuth: boolean = true // Indique si la requête nécessite une authentification
): Promise<T> => {
  // Nettoie les doubles slashes dans l'URL (sauf après http(s):)
  const url = `${API_BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(
    /^\/+/,
    ""
  )}`.replace(/([^:]\/)\/+/, "$1/");

  // Récupère le token AVANT de construire les headers
  let token: string | null = null;
  if (requireAuth) {
    token = localStorage.getItem("token");
    if (!token) throw new Error("Non autorisé - Token manquant");
    // Vérifie la validité du token
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp <= currentTime) {
        localStorage.removeItem("token");
        throw new Error("Non autorisé - Token expiré");
      }
    } catch {
      localStorage.removeItem("token");
      throw new Error("Non autorisé - Token invalide");
    }
  }

  // Construit les headers
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // Prépare le body
  let bodyToSend = options.body;
  if (
    bodyToSend &&
    typeof bodyToSend === "object" &&
    !(bodyToSend instanceof FormData)
  ) {
    bodyToSend = JSON.stringify(bodyToSend);
    headers["Content-Type"] = "application/json";
  }
  // Si FormData, ne pas mettre Content-Type (le navigateur le gère)
  if (bodyToSend instanceof FormData) {
    // Supprime Content-Type même si passé dans options.headers
    Object.keys(headers).forEach((key) => {
      if (key.toLowerCase() === "content-type") {
        delete headers[key];
      }
    });
  }

  // Prépare les options du fetch
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    body: bodyToSend,
    // credentials: "include", // Active-le si tu utilises des cookies de session
  };

  // (Suppression des logs de debug)

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      let errorMessage = `Erreur HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }
    if (response.status === 204) {
      return null as unknown as T;
    }
    try {
      const data = await response.json();
      return data as T;
    } catch {
      throw new Error("Réponse non JSON du serveur");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Erreur réseau inconnue");
    }
  }
};
