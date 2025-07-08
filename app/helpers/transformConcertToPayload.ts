import { Concert, ConcertCreatePayload } from "../types/Concert";

export const transformConcertToPayload = (
  concert: Concert
): ConcertCreatePayload => ({
  title: concert.title,
  description: concert.description,
  performer: concert.performer,
  time: concert.time,
  location: concert.location,
  image: concert.image ?? "",
  dayIds:
    concert.days
      ?.map((day) => day.id)
      .filter((id): id is number => typeof id === "number") ?? [],
});
