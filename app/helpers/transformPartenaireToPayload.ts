import { Partenaire, PartenaireCreatePayload } from "@/app/types/Partenaire";

export const transformPartenaireToPayload = (
  partenaire: Partenaire
): PartenaireCreatePayload => {
  const payload: Partial<PartenaireCreatePayload> = {
    name: partenaire.name,
    type: partenaire.type,
    link: partenaire.link,
    logo_alt: partenaire.logo_alt,
    actif: partenaire.actif,
  };

  // Gestion de l'image
  if (
    typeof partenaire.image === "string" &&
    partenaire.image &&
    !partenaire.image.startsWith("data:")
  ) {
    // Image existante - la garder
    payload.image = partenaire.image;
  } else {
    // Pas d'image - marquer pour suppression
    payload.image = undefined;
  }

  return payload as PartenaireCreatePayload;
};

export type PartenairePayload = PartenaireCreatePayload;
