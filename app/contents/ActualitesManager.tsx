import ImagePreview from "@/app/components/ImagePreview";
import ContentManager from "@/app/contents/genericT/ContentManager";
import {
  ActualitePayload,
  transformActualiteToPayload,
} from "@/app/helpers/transformActualiteToPayload";
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
      render: (row: Actualite) => {
        const getImportanceBadgeClass = (importance: string) => {
          switch (importance) {
            case "Très important":
              return "bg-red-100 text-red-800";
            case "Important":
              return "bg-orange-100 text-orange-800";
            case "Modéré":
              return "bg-green-100 text-green-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <span
            className={`inline-flex items-center justify-center text-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImportanceBadgeClass(
              row.importance
            )}`}
          >
            {row.importance}
          </span>
        );
      },
    },
    {
      id: "actif",
      label: "Actif",
      render: (row: Actualite) => (
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
      id: "image",
      label: "Image",
      render: (row: Actualite) => (
        <ImagePreview
          src={row.image}
          alt="Aperçu de l'actualité"
          width={60}
          height={60}
        />
      ),
    },
    {
      id: "created_at",
      label: "Créé le",
      render: (row: Actualite) =>
        new Date(row.created_at).toLocaleDateString("fr-FR"),
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
        transformData={transformActualiteToPayload}
      />
    </Container>
  );
};

export default ActualitesManager;
