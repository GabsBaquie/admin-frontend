// app/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // pour inclure les cookies si nécessaire
});

// Ajouter un intercepteur pour inclure le token dans les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Récupère le token depuis localStorage
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`; // Ajoute le token à l'en-tête
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
