// app/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api", // Valeur par défaut si variable manquante
  withCredentials: true, // pour inclure les cookies si nécessaire
});

// Intercepteur pour inclure le token dans chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Récupère le token depuis localStorage
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`; // Ajoute le token à l'en-tête Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // En cas d'erreur dans la requête
  }
);

// Intercepteur de réponse pour gérer les erreurs globalement (401, etc.)
axiosInstance.interceptors.response.use(
  (response) => response, // Renvoie la réponse si elle est réussie
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si l'utilisateur est non authentifié, redirection vers la page de connexion
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
