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
      id: "logo_url",
      label: "Logo",
      render: (row: Partenaire) => {
        if (typeof row.logo_url !== "string" || !row.logo_url) return null;

        let imageUrl = row.logo_url;
        if (!imageUrl.startsWith("http") && !imageUrl.startsWith("data:")) {
          const apiBaseUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
          const assetsUrl = apiBaseUrl.replace("/api", "");
          const cleanPath = imageUrl.startsWith("/")
            ? imageUrl.slice(1)
            : imageUrl;
          imageUrl = `${assetsUrl}/${cleanPath}`;
        }

        return (
          <img
            src={imageUrl}
            alt={row.logo_alt}
            style={{
              maxWidth: 60,
              maxHeight: 60,
              borderRadius: 4,
              background: "#eee",
            }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        );
      },
    },
    {
      id: "actif",
      label: "Actif",
      render: (row: Partenaire) => (
        <span
          style={{
            color: row.actif ? "#388e3c" : "#d32f2f",
            fontWeight: "bold",
          }}
        >
          {row.actif ? "Oui" : "Non"}
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
    { name: "link", label: "Lien", required: true, type: "url" },
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
    { name: "logo_url", label: "Logo", required: false, type: "image" },
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
