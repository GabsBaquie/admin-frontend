// app/contents/page.tsx

"use client";

import ContentManager from "@/app/contents/genericT/ContentManager";
import { Container } from "@mui/material";
import React from "react";

const ArticlesPage: React.FC = () => {
  const columns = [
    { id: "id" as const, label: "ID" },
    { id: "name" as const, label: "Titre" },
    { id: "author" as const, label: "Auteur" },
    { id: "createdAt" as const, label: "Créé le" },
  ];

  const fields = [
    { name: "title" as const, label: "Titre", required: true },
    { name: "body" as const, label: "Contenu", required: true },
    { name: "author" as const, label: "Auteur", required: true },
  ];

  return (
    <Container maxWidth="lg">
      <ContentManager
        contentType="articles"
        columns={columns}
        fields={fields}
      />
    </Container>
  );
};

export default ArticlesPage;
