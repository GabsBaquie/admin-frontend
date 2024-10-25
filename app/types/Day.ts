// app/types/Day.ts

import { Concert } from './Concert';

export type Day = {
  id: number;
  title: string;
  date: string;
  programId: number;
  concerts?: Concert[];
};
