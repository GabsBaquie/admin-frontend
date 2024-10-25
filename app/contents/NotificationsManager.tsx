import { Notification } from '@/app/types/Notification';
import React from 'react';
import ContentManager from '@/app/contents/genericT/ContentManager';

// Use the Notification type directly
const NotificationsManager: React.FC = () => {
  const contentType = 'notifications';
  const columns = [
    { id: 'id' as keyof Notification, label: 'ID' },
    { id: 'title' as keyof Notification, label: 'Title' },
    { id: 'message' as keyof Notification, label: 'Message' },
    { id: 'type' as keyof Notification, label: 'Type' },
    { id: 'recipient' as keyof Notification, label: 'Destinataire' },
    { id: 'createdAt' as keyof Notification, label: 'Créé le' },
    { id: 'updatedAt' as keyof Notification, label: 'Mis à Jour le' },
  ];
  const fields = [
    { name: 'title' as keyof Notification, label: 'Title', required: true },
    {
      name: 'message' as keyof Notification,
      label: 'Message',
      required: true,
    },
    { name: 'type' as keyof Notification, label: 'Type', required: true },
    {
      name: 'recipient' as keyof Notification,
      label: 'Destinataire',
      required: true,
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

export default NotificationsManager;
