export type ConcertPayload = {
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image?: string;
  dayIds: number[];
};

export const transformConcertToPayload = (concert: any): ConcertPayload => {
  const payload = {
    title: concert.title,
    description: concert.description,
    performer: concert.performer,
    time: concert.time,
    location: concert.location,
    image: concert.image ?? "",
    dayIds:
      concert.dayIds ??
      concert.days?.filter(Boolean).map((day: any) => day.id) ??
      [],
  };
  console.log("Payload transformConcertToPayload:", payload);
  return payload;
};
