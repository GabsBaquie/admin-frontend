import { useMemo } from "react";

export const useImageUrl = (src: string) => {
  return useMemo(() => {
    if (!src) return "";

    // URLs complètes
    if (src.startsWith("http") || src.startsWith("data:")) {
      return src;
    }

    // Corriger les URLs malformées
    if (src.includes("https:/.") && !src.includes("https://")) {
      return src.replace("https:/.", "https://");
    }

    // Construire l'URL avec l'API base
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://api.nation-sounds.fr";
    const cleanBaseUrl = apiBaseUrl.replace("/api", "");
    const cleanPath = src.startsWith("/") ? src.slice(1) : src;
    return `${cleanBaseUrl}/${cleanPath}`;
  }, [src]);
};
