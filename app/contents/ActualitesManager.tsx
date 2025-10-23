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
        const importanceColors = {
          "Très important": "#d32f2f",
          Important: "#f57c00",
          Modéré: "#388e3c",
        };
        return (
          <span
            style={{
              color: importanceColors[row.importance],
              fontWeight: "bold",
            }}
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
      id: "image",
      label: "Image",
      render: (row: Actualite) => {
        if (typeof row.image !== "string" || !row.image) return null;

        let imageUrl = row.image;
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
            alt="aperçu"
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
