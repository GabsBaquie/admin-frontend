// app/types/Day.ts

import { Concert } from "./Concert";

export type Day = {
  id: number;
  title: string;
  date: string;
  image?: string;
  concertIds: number[];
  concerts?: Concert[];
};

export type DayCreatePayload = {
  title: string;
  date: string;
  image?: string;
  concertIds: number[];
};
