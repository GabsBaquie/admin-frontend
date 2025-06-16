import React from 'react';
import { POI } from '@/app/types/POI';
import ContentManager from '@/app/contents/genericT/ContentManager';
import { Field } from '@/app/types/content';

const POIsManager: React.FC = () => {
  const contentType = 'pois';
  const columns = [
    { id: 'title' as keyof POI, label: 'Nom' },
    { id: 'type' as keyof POI, label: 'Type' },
    { id: 'latitude' as keyof POI, label: 'Latitude' },
    { id: 'longitude' as keyof POI, label: 'Longitude' },
    { id: 'description' as keyof POI, label: 'Description' },
    { id: 'createdAt' as keyof POI, label: 'Créé le' },
    { id: 'updatedAt' as keyof POI, label: 'Mis à Jour le' },
  ];
  const fields: Field<POI>[] = [
    { name: 'title', label: 'Nom', required: true, type: 'text' },
    { name: 'category', label: 'Catégorie', required: true, type: 'text' },
    { name: 'latitude', label: 'Latitude', required: true, type: 'text' },
    { name: 'longitude', label: 'Longitude', required: true, type: 'text' },
    { name: 'description', label: 'Description', required: false, type: 'textarea' },
  ];

  return (
    <ContentManager<POI, POI>
      contentType={contentType}
      columns={columns}
      fields={fields}
    />
  );
};

export default POIsManager;
