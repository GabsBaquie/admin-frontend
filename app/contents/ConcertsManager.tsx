// app/contents/ConcertsManager.tsx

'use client';

import ContentManager from '@/app/contents/genericT/ContentManager';
import { Concert } from '@/app/types/Concert';
import { Container } from '@mui/material';
import React from 'react';

const ConcertsManager: React.FC = () => {
  const contentType = 'concerts';
  const columns = [
    { id: 'id' as keyof Concert, label: 'ID' },
    { id: 'title' as keyof Concert, label: 'Nom' },
    { id: 'description' as keyof Concert, label: 'Description' },
    { id: 'performer' as keyof Concert, label: 'Interprète' },
    { id: 'time' as keyof Concert, label: 'Heure' },
    { id: 'location' as keyof Concert, label: 'Lieu' },
    { id: 'image' as keyof Concert, label: 'Image' },
    { id: 'createdAt' as keyof Concert, label: 'Créé le' },
    { id: 'updatedAt' as keyof Concert, label: 'Mis à jour le' },
  ];

  const fields = [
    { name: 'title' as keyof Concert, label: 'Nom', required: true },
    {
      name: 'description' as keyof Concert,
      label: 'Description',
      required: true,
      type: 'textarea',
    },
    { name: 'performer' as keyof Concert, label: 'Interprète', required: true },
    {
      name: 'time' as keyof Concert,
      label: 'Heure',
      required: true,
      type: 'time',
    },
    { name: 'location' as keyof Concert, label: 'Lieu', required: true },
    { name: 'image' as keyof Concert, label: 'Image', required: true },
    {
      name: 'createdAt' as keyof Concert,
      label: 'Date de création',
      required: true,
      type: 'date',
    },
    {
      name: 'updatedAt' as keyof Concert,
      label: 'Date de mise à jour',
      required: true,
      type: 'date',
    },
  ];

  return (
    <Container maxWidth="lg">
      <ContentManager
        contentType={contentType}
        columns={columns}
        fields={fields}
      />
    </Container>
  );
};

export default ConcertsManager;
