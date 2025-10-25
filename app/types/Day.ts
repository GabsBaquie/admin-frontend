export interface Day {
  id: number;
  title: string;
  date: string;
  image?: string;
  concerts?: Array<{ id: number; title: string; time: string }>;
  created_at: string;
  updated_at: string;
}
