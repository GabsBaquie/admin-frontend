import { Partenaire, PartenaireCreatePayload } from "@/app/types/Partenaire";

export const transformPartenaireToPayload = (
  partenaire: Partenaire
): PartenaireCreatePayload => {
  return {
    name: partenaire.name,
    type: partenaire.type,
    link: partenaire.link,
    logo_url: partenaire.logo_url,
    logo_alt: partenaire.logo_alt,
    actif: partenaire.actif,
  };
};

export type PartenairePayload = PartenaireCreatePayload;
