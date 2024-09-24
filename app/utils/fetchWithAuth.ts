export const fetchWithAuth = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  // Base URL de l'API
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  // Construire l'URL complète
  const url = `${baseURL}/${endpoint}`;

  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token manquant, redirection vers la page de connexion.");
    // Ici, vous pourriez rediriger l'utilisateur vers la page de connexion
    throw new Error("Token manquant, veuillez vous reconnecter.");
  }

  // Configurer les en-têtes
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
    ...options.headers,
  };

  // Options fetch, avec gestion des cookies (si nécessaire)
  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include", // Inclure les cookies si votre API les nécessite
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Gérer les erreurs de réponse HTTP
    if (!response.ok) {
      let errorMessage = "Erreur lors de la requête.";

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } else {
        const errorText = await response.text();
        console.error("Réponse inattendue:", errorText);
        errorMessage = `Réponse inattendue: ${errorText}`;
      }

      if (response.status === 401) {
        console.error("Jeton invalide ou expiré, redirection.");
        // Vous pouvez rediriger l'utilisateur vers la page de login ici si besoin
        throw new Error("Session expirée, veuillez vous reconnecter.");
      }

      throw new Error(errorMessage);
    }

    // Si la réponse est "No Content" (204)
    if (response.status === 204) {
      return null as unknown as T;
    }

    // Récupérer le corps de la réponse en JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("Erreur dans FetchWithAuth:", error);
    throw error;
  }
};
