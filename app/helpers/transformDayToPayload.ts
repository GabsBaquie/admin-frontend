import { Day } from "../types/Day";

export type DayCreateOrUpdatePayload = {
  title: string;
  date: string;
  concertIds: number[];
};

export const transformDayToPayload = (day: Day): DayCreateOrUpdatePayload => ({
  title: day.title,
  date: day.date,
  concertIds:
    day.concerts?.map((concert) => concert.id) ?? day.concertIds ?? [],
});
