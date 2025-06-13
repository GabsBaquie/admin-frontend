import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DataTable from '@/app/components/DataTable';
import DeleteConfirmation from '@/app/components/DeleteConfirmation';
import FormModal from '@/app/components/FormModal';
import Notification from '@/app/components/Notification';
import { Column, Field } from '@/app/types/content';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

interface BaseContent {
  id?: number;
  days?: number[];
  image?: string;
  time?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContentManagerProps<T extends { id: number }, U extends BaseContent> {
  contentType: string;
  columns: Column<T>[];
  fields: Field<U>[];
  transformData?: (data: T) => U;
}

const ContentManager = <T extends { id: number }, U extends BaseContent>({
  contentType,
  columns,
  fields,
  transformData,
}: ContentManagerProps<T, U>) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<{
    isFormOpen: boolean;
    isDeleteOpen: boolean;
    currentItem: T | null;
    notification: {
      open: boolean;
      message: string;
      severity: 'success' | 'error' | 'warning' | 'info';
    };
  }>({
    isFormOpen: false,
    isDeleteOpen: false,
    currentItem: null,
    notification: { open: false, message: '', severity: 'success' },
  });

  const { isFormOpen, isDeleteOpen, currentItem, notification } = state;

  const setNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setState((prev) => ({ ...prev, notification: { open: true, message, severity } }));
  };

  const { data, error, isLoading } = useQuery<T[], Error>({
    queryKey: [contentType],
    queryFn: async () => fetchWithAuth<T[]>(`${contentType}`, { method: 'GET' }),
  });

  const mutationHandler = (method: 'POST' | 'PUT' | 'DELETE', url: string, payload?: Partial<T> | U) => {
    if (payload) {
      console.log('Sending data to backend:', JSON.stringify(payload, null, 2));
    }
    return fetchWithAuth<T | void>(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
  };

  const createMutation = useMutation({
    mutationFn: (newData: U) =>
      mutationHandler('POST', contentType, newData as unknown as Partial<T>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setState((prev) => ({ ...prev, isFormOpen: false }));
      setNotification('Contenu créé avec succès', 'success');
    },
    onError: (error: Error) => setNotification(error.message || 'Erreur lors de la création', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: U & { id: number }) =>
      mutationHandler(
        'PUT',
        `${contentType}/${updatedData.id}`,
        updatedData as unknown as Partial<T>,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setState((prev) => ({ ...prev, isFormOpen: false }));
      setNotification('Contenu mis à jour avec succès', 'success');
    },
    onError: (error: Error) => setNotification(error.message || 'Erreur lors de la mise à jour', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mutationHandler('DELETE', `${contentType}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setState((prev) => ({ ...prev, isDeleteOpen: false }));
      setNotification('Contenu supprimé avec succès', 'success');
    },
    onError: (error: Error) => setNotification(error.message || 'Erreur lors de la suppression', 'error'),
  });

  const handleEdit = (item: T) => setState((prev) => ({ ...prev, currentItem: item, isFormOpen: true }));
  const handleDelete = (item: T) => setState((prev) => ({ ...prev, currentItem: item, isDeleteOpen: true }));

  const handleFormSubmit = (data: Partial<U>) => {
    // Transformer les données pour correspondre au format attendu par le backend
    const transformedData = {
      ...data,
      days: data.days || [],
      image: data.image || '',
      // S'assurer que le champ time est au format HH:mm
      time: data.time ? new Date(`1970-01-01T${data.time}`).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }) : '',
      // Utiliser le format ISO pour les dates
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    } as U;

    console.log('Form data before transformation:', data);
    console.log('Transformed data:', transformedData);

    if (currentItem) {
      const updatedData = { ...transformedData, id: currentItem.id } as U & { id: number };
      updateMutation.mutate(updatedData);
    } else {
      createMutation.mutate(transformedData);
    }
  };

  const handleConfirmDelete = () => {
    if (currentItem) {
      deleteMutation.mutate(currentItem.id);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="div">
          Gestion des {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setState((prev) => ({ ...prev, currentItem: null, isFormOpen: true }))}
        >
          Créer Nouveau
        </Button>
      </Box>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error.message}</Typography>
      ) : (
        <DataTable columns={columns} data={data || []} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <FormModal<U>
        open={isFormOpen}
        onClose={() => setState((prev) => ({ ...prev, isFormOpen: false }))}
        onSubmit={handleFormSubmit}
        initialData={currentItem ? (transformData ? transformData(currentItem) : currentItem as unknown as U) : undefined}
        title={currentItem ? `Modifier ${contentType.slice(0, -1)}` : `Créer ${contentType.slice(0, -1)}`}
        fields={fields}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={() => setState((prev) => ({ ...prev, isDeleteOpen: false }))}
        onConfirm={handleConfirmDelete}
        itemName={currentItem ? (currentItem as unknown as { title?: string }).title || `ID: ${currentItem.id}` : ''}
      />
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setState((prev) => ({ ...prev, notification: { ...prev.notification, open: false } }))}
      />
    </Box>
  );
};

export default ContentManager;