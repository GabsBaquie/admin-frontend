import ImagePreview from "@/app/components/ImagePreview";
import ImportanceBadge from "@/app/components/ImportanceBadge";
import StatusBadge from "@/app/components/StatusBadge";
import ContentManager from "@/app/contents/genericT/ContentManager";
import { ActualitePayload } from "@/app/helpers/transformActualiteToPayload";
import { Actualite } from "@/app/types/Actualite";
import { Column, Field } from "@/app/types/content";
import { Container } from "@mui/material";
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
      render: (row: Actualite) => (
        <ImportanceBadge importance={row.importance} />
      ),
    },
    {
      id: "actif",
      label: "Actif",
      render: (row: Actualite) => <StatusBadge isActive={row.actif} />,
    },
    {
      id: "image",
      label: "Image",
      render: (row: Actualite) => (
        <ImagePreview
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
      render: (row: Actualite) => {
        if (row.created_at) {
          const date = new Date(row.created_at);
          return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
        return "";
      },
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
    <Container maxWidth="lg">
      <ContentManager<Actualite, ActualitePayload>
        contentType={contentType}
        columns={columns}
        fields={fields}
      />
    </Container>
  );
};

export default ActualitesManager;
