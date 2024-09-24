//  app/types/Day.ts

import { Concert } from "./Concert";

export type Day = {
  id: number;
  date: string;
  programId: number;
  concerts?: Concert[];
};
