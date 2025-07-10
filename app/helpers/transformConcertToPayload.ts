import type { Concert } from "@/app/types/Concert";

export type ConcertPayload = {
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image?: string;
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
  // On n'ajoute image que si ce n'est pas une string vide
  if (typeof concert.image === "string" && concert.image) {
    payload.image = concert.image;
  } else if (concert.image && typeof concert.image !== "string") {
    // Si c'est un File (upload), on le laisse passer
    payload.image = concert.image;
  }
  console.log("Payload transformConcertToPayload:", payload);
  return payload as ConcertPayload;
};
