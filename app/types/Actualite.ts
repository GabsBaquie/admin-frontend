export type Actualite = {
  id: number;
  title: string;
  description: string;
  text: string;
  image: string;
  importance: "Très important" | "Important" | "Modéré";
  actif: boolean;
  created_at: string;
  updated_at: string;
};

export type ActualiteCreatePayload = {
  title: string;
  description: string;
  text: string;
  image?: string;
  importance: "Très important" | "Important" | "Modéré";
  actif: boolean;
};
