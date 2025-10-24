import { API_BASE_URL } from "./api";

// Lister les images serveur
export const getServerImages = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload/list`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des images");
    }
    const data = await response.json();
    // Vérifier que la réponse est un tableau
    return Array.isArray(data) ? data : [];
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

    const response = await fetch(`${API_BASE_URL}/upload/image/${filename}`, {
      method: "DELETE",
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

// Renommer une image serveur
export const renameServerImage = async (
  filename: string,
  newName: string
): Promise<{ newPath: string }> => {
  try {
    // Vérifier que les paramètres sont valides
    if (!filename || typeof filename !== "string") {
      throw new Error("Nom de fichier invalide");
    }
    if (!newName || typeof newName !== "string") {
      throw new Error("Nouveau nom invalide");
    }

    const response = await fetch(`${API_BASE_URL}/upload/image/${filename}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newName }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur lors du renommage" }));
      throw new Error(errorData.message || "Erreur lors du renommage");
    }

    const result = await response.json();
    // Vérifier que la réponse contient newPath
    if (!result || typeof result.newPath !== "string") {
      throw new Error("Réponse invalide du serveur");
    }

    return result;
  } catch (error) {
    console.error("Erreur renameServerImage:", error);
    throw error;
  }
};
