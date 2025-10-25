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
    dayIds: (() => {
      const concertData = concert as Record<string, unknown>;

      // Si c'est déjà un tableau de dayIds (depuis le formulaire)
      if (Array.isArray(concertData.dayIds)) {
        return concertData.dayIds.filter(
          (id): id is number => typeof id === "number" && id > 0
        );
      }

      // Si c'est un objet Concert avec des days
      if (Array.isArray(concertData.days)) {
        return concertData.days
          .filter((day: Record<string, unknown>) => typeof day.id === "number")
          .map((day: Record<string, unknown>) => day.id as number);
      }

      return [];
    })(),
    // Gestion de l'image
    image: (() => {
      if (
        typeof concert.image === "string" &&
        concert.image &&
        !concert.image.startsWith("data:")
      ) {
        // Image existante - la garder
        return concert.image;
      } else {
        // Pas d'image - marquer pour suppression
        return null;
      }
    })(),
  };

  return payload as ConcertPayload;
};
