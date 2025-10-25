import { API_BASE_URL } from "./api";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  // Utilise fetch natif pour avoir l'objet Response
  const response = await fetch(
    `${API_BASE_URL.replace(/\/+$/, "")}/upload/image`,
    {
      method: "POST",
      body: formData,
      // PAS de Content-Type ici !
      headers: {
        // Ajoute l'Authorization si besoin :
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    }
  );

  const text = await response.text();

  if (!response.ok) {
    console.error("[uploadImage] Réponse non OK:", response.status, text);
    throw new Error(`Erreur upload image: ${response.status} - ${text}`);
  }

  let result: { image?: string; [key: string]: unknown };
  try {
    result = JSON.parse(text);
  } catch (e) {
    console.error("[uploadImage] Erreur de parsing JSON :", e, text);
    throw new Error("Réponse du backend non JSON : " + text);
  }

  if (!result.image) {
    console.error("[uploadImage] Pas d'URL image retournée :", result);
    throw new Error("Pas d'URL image retournée");
  }

  return result.image;
};

export const validateImageFile = (file: File): string | null => {
  // Vérifier que le fichier existe et a un nom
  if (!file || !file.name) {
    return "Fichier invalide";
  }

  // Vérifier la taille (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return "L'image ne doit pas dépasser 5MB";
  }

  // Vérifier le type
  if (!file.type || !file.type.startsWith("image/")) {
    return "Veuillez sélectionner un fichier image valide";
  }

  // Vérifier les extensions autorisées
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const fileName = file.name.toLowerCase();

  // Protection contre les noms de fichiers null/undefined
  if (!fileName) {
    return "Nom de fichier invalide";
  }

  const hasValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return "Format d'image non supporté. Utilisez JPG, PNG, GIF ou WebP";
  }

  return null;
};
