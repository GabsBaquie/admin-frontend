// app/utils/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Intercepteur pour inclure le token dans chaque requête
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

// Intercepteur de réponse pour gérer les erreurs globalement (401, etc.)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const requestURL = error.config.url;
      const ignoreRedirect = [
        "/auth/login",
        "/auth/reset-password-request",
        "/auth/reset-password",
      ];
      const currentPath = window.location.pathname;

      // Ne redirige pas si la requête est pour les endpoints ignorés ou si l'utilisateur est déjà sur /login
      if (!ignoreRedirect.includes(requestURL) && currentPath !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
