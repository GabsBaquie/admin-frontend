import React, { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import DataTable from '@/app/components/DataTable';
import DeleteConfirmation from '@/app/components/DeleteConfirmation';
import FormModal from '@/app/components/FormModal';
import Notification from '@/app/components/Notification';
import { Column, Field } from '@/app/types/content';
import { fetchWithAuth } from '@/app/utils/fetchWithAuth';

interface ContentManagerProps<T, U> {
  contentType: string;
  columns: Column<T>[];
  fields: Field<T>[];
  transformData?: (data: T) => U;
}

const ContentManager = <T extends { id: number; title: string }, U>({
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
    return fetchWithAuth<T | void>(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: payload ? JSON.stringify(payload) : undefined,
    });
  };

  const createMutation = useMutation({
    mutationFn: (newData: T) =>
      mutationHandler('POST', contentType, transformData ? (transformData(newData) as Partial<T>) : newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setState((prev) => ({ ...prev, isFormOpen: false }));
      setNotification('Contenu créé avec succès', 'success');
    },
    onError: (error: Error) => setNotification(error.message || 'Erreur lors de la création', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: T) =>
      mutationHandler(
        'PUT',
        `${contentType}/${updatedData.id}`,
        transformData ? (transformData(updatedData) as Partial<T>) : updatedData,
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

  const handleFormSubmit = (data: Partial<T>) => {
    if (currentItem) {
      updateMutation.mutate({ ...currentItem, ...data } as T);
    } else {
      createMutation.mutate(data as T);
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
      <FormModal
        open={isFormOpen}
        onClose={() => setState((prev) => ({ ...prev, isFormOpen: false }))}
        onSubmit={handleFormSubmit}
        initialData={currentItem || undefined}
        title={currentItem ? `Modifier ${contentType.slice(0, -1)}` : `Créer ${contentType.slice(0, -1)}`}
        fields={fields}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={() => setState((prev) => ({ ...prev, isDeleteOpen: false }))}
        onConfirm={handleConfirmDelete}
        itemName={currentItem ? currentItem.title || `ID: ${currentItem.id}` : ''}
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