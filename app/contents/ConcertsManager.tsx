// app/contents/ConcertsManager.tsx

"use client";

import ContentManager from "@/app/contents/genericT/ContentManager";
import { Container } from "@mui/material";
import React from "react";

const ConcertsManager: React.FC = () => {
  const columns = [
    { id: "id" as const, label: "ID" },
    { id: "name" as const, label: "Nom" },
    { id: "date" as const, label: "Date" },
    { id: "location" as const, label: "Lieu" },
  ];

  const fields = [
    { name: "name" as const, label: "Nom", required: true },
    { name: "date" as const, label: "Date", required: true, type: "date" },
    { name: "location" as const, label: "Lieu", required: true },
  ];

  return (
    <Container maxWidth="lg">
      <ContentManager
        contentType="concerts"
        columns={columns}
        fields={fields}
      />
    </Container>
  );
};

export default ConcertsManager;
