// app/utils/axiosInstance.ts
import axios from "axios";

console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL); // Vérifier la base URL

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Ajouter un intercepteur pour inclure le token dans les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
