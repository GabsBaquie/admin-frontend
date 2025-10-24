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
    { id: "importance", label: "Importance" },
    { id: "actif", label: "Actif" },
    { id: "image", label: "Image" },
    { id: "created_at", label: "Créé le" },
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
