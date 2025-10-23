import type { Concert } from "@/app/types/Concert";

export type ConcertPayload = {
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image?: string | null; // Peut être null pour suppression
  dayIds: number[];
};

export const transformConcertToPayload = (
  concert: Concert | ConcertPayload
): ConcertPayload => {
  const payload: Partial<ConcertPayload> = {
    title: concert.title,
    description: concert.description,
    performer: concert.performer,
    time: concert.time,
    location: concert.location,
    // Gérer les dayIds selon le type d'objet reçu
    dayIds: Array.isArray((concert as any).dayIds)
      ? (concert as any).dayIds // Si c'est déjà un tableau de dayIds (depuis le formulaire)
      : (concert as any).days
          ?.filter((day: any) => typeof day.id === "number")
          .map((day: any) => day.id) ?? [], // Si c'est un objet Concert avec des days
    // Ajout explicite du champ image, même s'il vaut null
    image:
      typeof concert.image === "string" &&
      concert.image &&
      !concert.image.startsWith("data:")
        ? concert.image
        : null,
  };

  console.log("Payload transformConcertToPayload:", payload);
  return payload as ConcertPayload;
};
