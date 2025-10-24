import ContentManager from "@/app/contents/genericT/ContentManager";
import {
  PoiPayload,
  transformPoiToPayload,
} from "@/app/helpers/transformPoiToPayload";
import { Field } from "@/app/types/content";
import { POI } from "@/app/types/POI";
import React from "react";

const POIsManager: React.FC = () => {
  const contentType = "pois";
  const columns = [
    { id: "title" as keyof POI, label: "Nom" },
    { id: "type" as keyof POI, label: "Type" },
    { id: "latitude" as keyof POI, label: "Latitude" },
    { id: "longitude" as keyof POI, label: "Longitude" },
    {
      id: "description" as keyof POI,
      label: "Description",
      render: (row: POI) => row.description || "",
    },
    {
      id: "category" as keyof POI,
      label: "Catégorie",
      render: (row: POI) => row.category || "",
    },
    {
      id: "address" as keyof POI,
      label: "Adresse",
      render: (row: POI) => row.address || "",
    },
  ];
  const fields: Field<PoiPayload>[] = [
    { name: "title", label: "Nom", required: true, type: "text" },
    { name: "type", label: "Type", required: true, type: "text" },
    { name: "latitude", label: "Latitude", required: true, type: "text" },
    { name: "longitude", label: "Longitude", required: true, type: "text" },
    {
      name: "description",
      label: "Description",
      required: false,
      type: "textarea",
    },
    { name: "category", label: "Catégorie", required: false, type: "text" },
    { name: "address", label: "Adresse", required: false, type: "text" },
  ];

  return (
    <ContentManager<POI, PoiPayload>
      contentType={contentType}
      columns={columns}
      fields={fields}
      transformData={transformPoiToPayload}
    />
  );
};

export default POIsManager;
