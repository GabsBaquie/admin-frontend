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

export const transformConcertToPayload = (concert: Concert): ConcertPayload => {
  const payload: Partial<ConcertPayload> = {
    title: concert.title,
    description: concert.description,
    performer: concert.performer,
    time: concert.time,
    location: concert.location,
    dayIds:
      concert.days
        ?.filter((day) => typeof day.id === "number")
        .map((day) => day.id) ?? [],
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
