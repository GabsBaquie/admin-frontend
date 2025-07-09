import { POI } from "../types/POI";

export type PoiPayload = {
  title: string;
  type: string;
  latitude: number;
  longitude: number;
  description?: string;
  category?: string;
  address?: string;
};

export const transformPoiToPayload = (poi: POI): PoiPayload => ({
  title: poi.title,
  type: poi.category, // POI n'a pas de champ 'type', on mappe category -> type
  latitude: Number(poi.latitude),
  longitude: Number(poi.longitude),
  description: poi.description,
  category: poi.category,
  address: poi.address,
});
