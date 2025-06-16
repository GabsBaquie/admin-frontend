import ContentManager from '@/app/contents/genericT/ContentManager';
import { SecurityInfo } from '@/app/types/SecurityInfo';
import React from 'react';
import { Field } from '@/app/types/content';

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
  const fields: Field<SecurityInfo>[] = [
    { name: 'title', label: 'Titre', required: true, type: 'text' },
    { name: 'description', label: 'Description', required: true, type: 'textarea' },
    { name: 'urgence', label: 'Urgence', required: true, type: 'select', options: [
      { value: 1, label: 'Oui' },
      { value: 0, label: 'Non' },
    ] },
    { name: 'actif', label: 'Actif', required: true, type: 'select', options: [
      { value: 1, label: 'Oui' },
      { value: 0, label: 'Non' },
    ] },
  ];

  return (
    <ContentManager<SecurityInfo, SecurityInfo>
      contentType={contentType}
      columns={columns}
      fields={fields}
    />
  );
};

export default SecurityInfosManager;
