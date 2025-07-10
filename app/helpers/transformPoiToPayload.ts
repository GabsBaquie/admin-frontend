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

export const transformPoiToPayload = (
  poi:
    | POI
    | (Omit<POI, "latitude" | "longitude"> & {
        latitude: string | number;
        longitude: string | number;
      })
): PoiPayload => ({
  title: poi.title,
  type: poi.category, // POI n'a pas de champ 'type', on mappe category -> type
  latitude:
    typeof poi.latitude === "string" ? Number(poi.latitude) : poi.latitude,
  longitude:
    typeof poi.longitude === "string" ? Number(poi.longitude) : poi.longitude,
  description: poi.description,
  category: poi.category,
  address: poi.address,
});
