// frontend/src/pages/ProgramManager.tsx

import React from "react";
import ContentManager from "@/app/contents/genericT/ContentManager";
import { Program } from "../types/Program";
import { Box } from "@mui/material";

const ProgramManager: React.FC = () => {
  const contentType = "programs"; // Correspond à /api/programs
  const columns = [
    { id: "name" as keyof Program, label: "Nom" },
    { id: "description" as keyof Program, label: "Description" },
    { id: "createdAt" as keyof Program, label: "Créé le" },
    { id: "updatedAt" as keyof Program, label: "Mis à Jour le" },
  ];
  const fields = [
    { name: "name" as keyof Program, label: "Nom", required: true },
    {
      name: "description" as keyof Program,
      label: "Description",
      required: true,
      type: "textarea",
    },
    // Ajoutez d'autres champs si nécessaire
  ];

  return (
    <Box>
      <ContentManager<Program>
        contentType={contentType}
        columns={columns}
        fields={fields}
      />
    </Box>
  );
};

export default ProgramManager;
