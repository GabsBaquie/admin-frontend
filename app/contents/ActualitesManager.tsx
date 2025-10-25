import {
  DateRenderer,
  ImageRenderer,
  ImportanceRenderer,
  StatusRenderer,
} from "@/app/components/renderers";
import { BaseContentManager } from "@/app/contents/common";
import { ActualitePayload } from "@/app/helpers/transformActualiteToPayload";
import { Actualite } from "@/app/types/Actualite";
import { Column, Field } from "@/app/types/content";
import React from "react";

const ActualitesManager: React.FC = () => {
  const contentType = "actualites";

  const columns: Column<Actualite>[] = [
    { id: "id", label: "ID" },
    { id: "title", label: "Titre" },
    { id: "description", label: "Description" },
    {
      id: "importance",
      label: "Importance",
      render: (row: Actualite) => <ImportanceRenderer value={row.importance} />,
    },
    {
      id: "actif",
      label: "Actif",
      render: (row: Actualite) => <StatusRenderer value={row.actif} />,
    },
    {
      id: "image",
      label: "Image",
      render: (row: Actualite) => (
        <ImageRenderer
          src={row.image || ""}
          alt="Image de l'actualité"
          width={60}
          height={60}
        />
      ),
    },
    {
      id: "created_at",
      label: "Créé le",
      render: (row: Actualite) => <DateRenderer value={row.created_at} />,
    },
  ];

  const fields: Field<ActualitePayload>[] = [
    { name: "title", label: "Titre", required: true, type: "text" },
    {
      name: "description",
      label: "Description",
      required: true,
      type: "textarea",
    },
    {
      name: "text",
      label: "Texte complet",
      required: true,
      type: "textarea",
    },
    {
      name: "importance",
      label: "Importance",
      required: true,
      type: "select",
      options: [
        { value: "Très important", label: "Très important" },
        { value: "Important", label: "Important" },
        { value: "Modéré", label: "Modéré" },
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
    { name: "image", label: "Image", required: false, type: "image" },
  ];

  return (
    <BaseContentManager<Actualite, ActualitePayload>
      contentType={contentType}
      columns={columns}
      fields={fields}
    />
  );
};

export default ActualitesManager;
