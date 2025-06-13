// app/utils/api.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export const endpoints = {
  contents: (contentType: string) => `${API_BASE_URL}/${contentType}`,
  contentById: (contentType: string, id: number) =>
    `${API_BASE_URL}/${contentType}/${id}`,
};
