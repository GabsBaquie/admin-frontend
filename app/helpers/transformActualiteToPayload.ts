import { Actualite, ActualiteCreatePayload } from "@/app/types/Actualite";

export const transformActualiteToPayload = (
  actualite: Actualite
): ActualiteCreatePayload => {
  return {
    title: actualite.title,
    description: actualite.description,
    text: actualite.text,
    image: actualite.image,
    importance: actualite.importance,
    actif: actualite.actif,
  };
};

export type ActualitePayload = ActualiteCreatePayload;
