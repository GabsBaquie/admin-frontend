// frontend/src/components/SecurityInfosManager.tsx

import ContentManager from '@/app/contents/genericT/ContentManager';
import { SecurityInfo } from '@/app/types/SecurityInfo';
import React from 'react';

const SecurityInfosManager: React.FC = () => {
  const contentType = 'securityInfos';
  const columns = [
    { id: 'title' as keyof SecurityInfo, label: 'Titre' },
    { id: 'description' as keyof SecurityInfo, label: 'Description' },
    { id: 'urgence' as keyof SecurityInfo, label: 'Urgence' },
    { id: 'actif' as keyof SecurityInfo, label: 'Actif' },
    { id: 'createdAt' as keyof SecurityInfo, label: 'Créé le' },
    { id: 'updatedAt' as keyof SecurityInfo, label: 'Mis à Jour le' },
  ];
  const fields = [
    { name: 'title' as keyof SecurityInfo, label: 'Titre', required: true },
    {
      name: 'description' as keyof SecurityInfo,
      label: 'Description',
      required: true,
      type: 'textarea',
    },
    {
      name: 'urgence' as keyof SecurityInfo,
      label: 'Urgence',
      required: true,
      type: 'select',
      options: [
        { value: 1, label: 'Oui' },
        { value: 0, label: 'Non' },
      ],
    },
    {
      name: 'actif' as keyof SecurityInfo,
      label: 'Actif',
      required: true,
      type: 'select',
      options: [
        { value: 1, label: 'Oui' },
        { value: 0, label: 'Non' },
      ],
    },
    // Ajoutez d'autres champs si nécessaire
  ];

  return (
    <ContentManager
      contentType={contentType}
      columns={columns}
      fields={fields}
    />
  );
};

export default SecurityInfosManager;
