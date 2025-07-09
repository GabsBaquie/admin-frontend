import ContentManager from "@/app/contents/genericT/ContentManager";
import { Field } from "@/app/types/content";
import { SecurityInfo } from "@/app/types/SecurityInfo";
import React from "react";

type SecurityInfoPayload = {
  title: string;
  description: string;
  urgence: boolean;
  actif: boolean;
};

const transformSecurityInfoToPayload = (data: SecurityInfo) => ({
  title: data.title,
  description: data.description,
  urgence: String(data.urgence) === "true",
  actif: String(data.actif) === "true",
});

const SecurityInfosManager: React.FC = () => {
  const contentType = "securityInfos";
  const columns = [
    { id: "title" as keyof SecurityInfo, label: "Titre" },
    { id: "description" as keyof SecurityInfo, label: "Description" },
    { id: "urgence" as keyof SecurityInfo, label: "Urgence" },
    { id: "actif" as keyof SecurityInfo, label: "Actif" },
    { id: "createdAt" as keyof SecurityInfo, label: "Créé le" },
    { id: "updatedAt" as keyof SecurityInfo, label: "Mis à Jour le" },
  ];
  const fields: Field<SecurityInfoPayload>[] = [
    { name: "title", label: "Titre", required: true, type: "text" },
    {
      name: "description",
      label: "Description",
      required: true,
      type: "textarea",
    },
    {
      name: "urgence",
      label: "Urgence",
      required: true,
      type: "select",
      options: [
        { value: "true", label: "Oui" },
        { value: "false", label: "Non" },
      ],
    },
    {
      name: "actif",
      label: "Actif",
      required: true,
      type: "select",
      options: [
        { value: "true", label: "Oui" },
        { value: "false", label: "Non" },
      ],
    },
  ];

  return (
    <ContentManager<SecurityInfo, SecurityInfoPayload>
      contentType={contentType}
      columns={columns}
      fields={fields}
      transformData={transformSecurityInfoToPayload}
    />
  );
};

export default SecurityInfosManager;
