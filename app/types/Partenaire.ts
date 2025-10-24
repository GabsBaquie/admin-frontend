export type Partenaire = {
  id: number;
  name: string;
  type: "Institution" | "Media" | "Tech" | "Autre";
  link: string;
  image: string;
  logo_alt: string;
  actif: boolean;
  created_at: string;
  updated_at: string;
};

export type PartenaireCreatePayload = {
  name: string;
  type: "Institution" | "Media" | "Tech" | "Autre";
  link: string;
  image?: string;
  logo_alt: string;
  actif: boolean;
};
