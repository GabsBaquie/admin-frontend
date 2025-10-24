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

const transformSecurityInfoToPayload = (data: Partial<SecurityInfo>) => ({
  title: data.title ?? "",
  description: data.description ?? "",
  urgence:
    data.urgence !== undefined
      ? String(data.urgence) === "true" || data.urgence === true
      : false,
  actif:
    data.actif !== undefined
      ? String(data.actif) === "true" || data.actif === true
      : true,
});

const SecurityInfosManager: React.FC = () => {
  const contentType = "securityInfos";

  // Fonction pour formater les dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    { id: "title" as keyof SecurityInfo, label: "Titre" },
    { id: "description" as keyof SecurityInfo, label: "Description" },
    {
      id: "urgence" as keyof SecurityInfo,
      label: "Urgence",
      render: (row: SecurityInfo) => (
        <span
          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.urgence
              ? "bg-red-100 text-red-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {row.urgence ? "Urgent" : "Normal"}
        </span>
      ),
    },
    {
      id: "actif" as keyof SecurityInfo,
      label: "Actif",
      render: (row: SecurityInfo) => (
        <span
          className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.actif
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.actif ? "Actif" : "Inactif"}
        </span>
      ),
    },
    {
      id: "created_at" as keyof SecurityInfo,
      label: "Créé le",
      render: (row: SecurityInfo) => formatDate(row.created_at),
    },
    {
      id: "updated_at" as keyof SecurityInfo,
      label: "Mis à Jour le",
      render: (row: SecurityInfo) => formatDate(row.updated_at),
    },
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
