// frontend/src/components/POIsManager.tsx

import React from "react";
import { POI } from "@/app/types/POI";
import ContentManager from "@/app/contents/genericT/ContentManager";

const POIsManager: React.FC = () => {
  const contentType = "pois";
  const columns = [
    { id: "name" as keyof POI, label: "Nom" },
    { id: "type" as keyof POI, label: "Type" },
    { id: "latitude" as keyof POI, label: "Latitude" },
    { id: "longitude" as keyof POI, label: "Longitude" },
    { id: "description" as keyof POI, label: "Description" },
    { id: "createdAt" as keyof POI, label: "Créé le" },
    { id: "updatedAt" as keyof POI, label: "Mis à Jour le" },
  ];
  const fields = [
    { name: "name" as keyof POI, label: "Nom", required: true },
    { name: "type" as keyof POI, label: "Type", required: true },
    {
      name: "latitude" as keyof POI,
      label: "Latitude",
      required: true,
      type: "number",
    },
    {
      name: "longitude" as keyof POI,
      label: "Longitude",
      required: true,
      type: "number",
    },
    {
      name: "description" as keyof POI,
      label: "Description",
      required: false,
      type: "textarea",
    },
    // Ajoutez d'autres champs si nécessaire
  ];

  return (
    <ContentManager
      contentType={contentType}
      columns={columns}
      fields={fields}
    />
  );
};

export default POIsManager;
