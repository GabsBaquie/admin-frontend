import type { Concert } from "@/app/types/Concert";

export type ConcertPayload = {
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image?: string; // Maintenant c'est l'URL de l'image uploadée
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
  };

  // On n'ajoute image que si c'est une URL valide (pas base64)
  if (
    typeof concert.image === "string" &&
    concert.image &&
    !concert.image.startsWith("data:")
  ) {
    payload.image = concert.image;
  }

  console.log("Payload transformConcertToPayload:", payload);
  return payload as ConcertPayload;
};
