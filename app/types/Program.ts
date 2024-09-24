// app/types/Program.ts

import { Day } from "./Day";

export type Program = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  days?: Day[]; // Relation optionnelle
};
