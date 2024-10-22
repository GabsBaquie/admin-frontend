// app/types/content.ts

export type Column<T> = {
  id: keyof T extends 'id' ? 'id' : Extract<keyof T, string>;
  label: string;
};

export type Field<T> = {
  name: Extract<keyof T, string>;
  label: string;
  type?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
};

// Exemple d'un type de contenu générique
export type Content = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};
