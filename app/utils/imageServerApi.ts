import { API_BASE_URL } from "./api";

// Lister les images serveur
export const getServerImages = async (): Promise<string[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/upload/list`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des images");
    }
    const data = await response.json();
    // Vérifier que la réponse est un tableau
    if (Array.isArray(data)) {
      // Si les éléments sont des objets avec une propriété 'url', extraire les URLs
      return data
        .map((item) => {
          if (typeof item === "string") {
            return item;
          } else if (typeof item === "object" && item.url) {
            return item.url;
          }
          return "";
        })
        .filter((url) => url !== "");
    }
    return [];
  } catch (error) {
    console.error("Erreur getServerImages:", error);
    // Retourner un tableau vide en cas d'erreur
    return [];
  }
};

// Supprimer une image serveur
export const deleteServerImage = async (filename: string): Promise<void> => {
  try {
    // Vérifier que le filename est valide
    if (!filename || typeof filename !== "string") {
      throw new Error("Nom de fichier invalide");
    }

    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/upload/image/${filename}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur lors de la suppression" }));
      throw new Error(errorData.message || "Erreur lors de la suppression");
    }
  } catch (error) {
    console.error("Erreur deleteServerImage:", error);
    throw error;
  }
};
