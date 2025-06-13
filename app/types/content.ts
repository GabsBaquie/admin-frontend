export type Column<T> = {
  id: keyof T extends 'id' ? 'id' : Extract<keyof T, string>;
  label: string;
  render?: (row: T) => React.ReactNode;
};

export interface Field<T> {
  name: keyof T;
  label: string;
  required?: boolean;
  type?: 'text' | 'textarea' | 'time' | 'date' | 'multiselect' | 'select' | 'image';
  multiple?: boolean;
  options?: { value: string | number; label: string }[];
}

// Exemple d'un type de contenu générique
export type Content = {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};