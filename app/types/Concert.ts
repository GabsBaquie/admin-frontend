export type Concert = {
  id: number;
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image: string;
  days: Array<{
    id: number;
    title: string;
    date: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type ConcertCreatePayload = {
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image?: string;
  dayIds: number[];
};
