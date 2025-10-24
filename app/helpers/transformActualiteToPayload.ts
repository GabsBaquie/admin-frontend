import { Actualite, ActualiteCreatePayload } from "@/app/types/Actualite";

export const transformActualiteToPayload = (
  actualite: Actualite
): ActualiteCreatePayload => {
  const payload: Partial<ActualiteCreatePayload> = {
    title: actualite.title,
    description: actualite.description,
    text: actualite.text,
    importance: actualite.importance,
    actif: actualite.actif,
    // Gestion de l'image
    image: (() => {
      if (
        typeof actualite.image === "string" &&
        actualite.image &&
        !actualite.image.startsWith("data:")
      ) {
        // Image existante - la garder
        return actualite.image;
      } else {
        // Pas d'image - marquer pour suppression
        return undefined;
      }
    })(),
  };

  console.log("Payload transformActualiteToPayload:", payload);
  return payload as ActualiteCreatePayload;
};

export type ActualitePayload = ActualiteCreatePayload;
