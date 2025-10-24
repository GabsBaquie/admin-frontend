import ContentManager from "@/app/contents/genericT/ContentManager";
import {
  PartenairePayload,
  transformPartenaireToPayload,
} from "@/app/helpers/transformPartenaireToPayload";
import { Partenaire } from "@/app/types/Partenaire";
import { Column, Field } from "@/app/types/content";
import { Container } from "@mui/material";
import React from "react";

const PartenairesManager: React.FC = () => {
  const contentType = "partenaires";

  const columns: Column<Partenaire>[] = [
    { id: "id", label: "ID" },
    { id: "name", label: "Nom" },
    { id: "type", label: "Type" },
    { id: "link", label: "Lien" },
    { id: "image", label: "Logo" },
    { id: "actif", label: "Actif" },
    { id: "created_at", label: "Créé le" },
  ];

  const fields: Field<PartenairePayload>[] = [
    { name: "name", label: "Nom", required: true, type: "text" },
    {
      name: "type",
      label: "Type",
      required: true,
      type: "select",
      options: [
        { value: "Institution", label: "Institution" },
        { value: "Media", label: "Media" },
        { value: "Tech", label: "Tech" },
        { value: "Autre", label: "Autre" },
      ],
    },
    { name: "link", label: "Lien", required: true, type: "text" },
    {
      name: "logo_alt",
      label: "Texte alternatif du logo",
      required: true,
      type: "text",
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
    { name: "image", label: "Logo", required: false, type: "image" },
  ];

  return (
    <Container maxWidth="lg">
      <ContentManager<Partenaire, PartenairePayload>
        contentType={contentType}
        columns={columns}
        fields={fields}
        transformData={transformPartenaireToPayload}
      />
    </Container>
  );
};

export default PartenairesManager;
