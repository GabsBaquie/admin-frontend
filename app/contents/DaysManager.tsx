// app/contents/DaysManager.tsx

'use client';

import ContentManager from '@/app/contents/genericT/ContentManager';
import { Container } from '@mui/material';
import React from 'react';

const DaysManager: React.FC = () => {
  const contentType = 'days';
  const columns = [
    { id: 'id' as const, label: 'ID' },
    { id: 'title' as const, label: 'Nom' },
    { id: 'date' as const, label: 'Date' },
  ];

  const fields = [
    { name: 'title' as const, label: 'Nom', required: true },
    { name: 'date' as const, label: 'Date', required: true, type: 'date' },
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

export default DaysManager;
