import { Day } from "../types/Day";

export type DayCreateOrUpdatePayload = {
  title: string;
  date: string;
  concertIds: number[];
};

export const transformDayToPayload = (day: Day): DayCreateOrUpdatePayload => ({
  title: day.title,
  date: day.date,
  concertIds: Array.isArray(day.concerts)
    ? day.concerts
        .filter((concert) => typeof concert.id === "number")
        .map((concert) => concert.id)
    : day.concertIds ?? [],
});
