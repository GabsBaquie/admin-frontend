// app/contents/ProgramsManager.tsx

import React from 'react';
import ContentManager from '@/app/contents/genericT/ContentManager';
import { Program } from '@/app/types/Program';

const ProgramsManager: React.FC = () => {
  const contentType = 'programs';

  // Colonnes basées sur les propriétés du type Program
  const columns = [
    { id: 'id' as keyof Program, label: 'ID' },
    { id: 'title' as keyof Program, label: 'Nom' },
    { id: 'description' as keyof Program, label: 'Description' },
    { id: 'createdAt' as keyof Program, label: 'Créé le' },
    { id: 'updatedAt' as keyof Program, label: 'Mis à jour le' },
  ];

  // Champs pour le formulaire de création
  const fields = [
    { name: 'title' as keyof Program, label: 'Nom', required: true },
    {
      name: 'description' as keyof Program,
      label: 'Description',
      required: true,
      type: 'textarea',
    },
    {
      name: 'createdAt' as keyof Program,
      label: 'Date de création',
      required: true,
      type: 'date',
    },
    {
      name: 'updatedAt' as keyof Program,
      label: 'Date de mise à jour',
      required: true,
      type: 'date',
    },
  ];

  return (
    <ContentManager
      contentType={contentType}
      columns={columns}
      fields={fields}
    />
  );
};

export default ProgramsManager;
