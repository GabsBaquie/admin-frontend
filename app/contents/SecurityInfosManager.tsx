// frontend/src/components/SecurityInfosManager.tsx

import React from "react";
import { SecurityInfo } from "@/app/types/SecurityInfo";
import ContentManager from "@/app/contents/genericT/ContentManager";

const SecurityInfosManager: React.FC = () => {
  const contentType = "securityinfos";
  const columns = [
    { id: "title" as keyof SecurityInfo, label: "Titre" },
    { id: "description" as keyof SecurityInfo, label: "Description" },
    { id: "level" as keyof SecurityInfo, label: "Niveau" },
    { id: "createdAt" as keyof SecurityInfo, label: "Créé le" },
    { id: "updatedAt" as keyof SecurityInfo, label: "Mis à Jour le" },
  ];
  const fields = [
    { name: "title" as keyof SecurityInfo, label: "Titre", required: true },
    {
      name: "description" as keyof SecurityInfo,
      label: "Description",
      required: true,
      type: "textarea",
    },
    { name: "level" as keyof SecurityInfo, label: "Niveau", required: true },
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

export default SecurityInfosManager;
