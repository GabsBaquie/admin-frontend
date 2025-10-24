import ImagePreview from "@/app/components/ImagePreview";
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
    {
      id: "link",
      label: "Lien",
      render: (row: Partenaire) => (
        <a
          href={row.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#1976d2", textDecoration: "none" }}
        >
          {row.link}
        </a>
      ),
    },
    {
      id: "image",
      label: "Logo",
      render: (row: Partenaire) => (
        <ImagePreview
          src={row.image}
          alt={row.logo_alt}
          width={60}
          height={60}
        />
      ),
    },
    {
      id: "actif",
      label: "Actif",
      render: (row: Partenaire) => (
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
      id: "created_at",
      label: "Créé le",
      render: (row: Partenaire) =>
        new Date(row.created_at).toLocaleDateString("fr-FR"),
    },
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
