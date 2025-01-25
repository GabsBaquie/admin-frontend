// app/types/Day.ts

import { Concert } from './Concert';

export type Day = {
  id: number;
  title: string;
  date: string;
  concertIds: number[];
  concerts?: Concert[];
};
