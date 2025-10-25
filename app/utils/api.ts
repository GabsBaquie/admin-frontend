// app/utils/api.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.nation-sounds.fr/api";

export const endpoints = {
  contents: (contentType: string) => `${API_BASE_URL}/${contentType}`,
  contentById: (contentType: string, id: number) =>
    `${API_BASE_URL}/${contentType}/${id}`,
};
