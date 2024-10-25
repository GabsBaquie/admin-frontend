// app/types/Program.ts

import { Day } from './Day';

export type Program = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  days?: Day[]; // Relation optionnelle
};
