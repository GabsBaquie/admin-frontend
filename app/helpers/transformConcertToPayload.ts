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
  const payload = {
    title: concert.title,
    description: concert.description,
    performer: concert.performer,
    time: concert.time,
    location: concert.location,
    image: concert.image ?? "",
    dayIds:
      concert.days
        ?.filter((day) => typeof day.id === "number")
        .map((day) => day.id) ?? [],
  };
  console.log("Payload transformConcertToPayload:", payload);
  return payload;
};
