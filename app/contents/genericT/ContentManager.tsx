import DataTable from "@/app/components/DataTable";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import FormModal from "@/app/components/FormModal";
import Notification from "@/app/components/Notification";
import { Column, Field } from "@/app/types/content";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

// Interface pour le ContentManager avec types génériques
interface ContentManagerProps<T> {
  contentType: string;
  columns: Column<T>[];
  fields: Field<T>[]; // Utilisation du type générique Field<T>
}

const ContentManager = <T extends { id: number; name: string }>({
  contentType,
  columns,
  fields,
}: ContentManagerProps<T>) => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "success" });

  // Récupération des données via useQuery
  const { data, error, isLoading } = useQuery<T[], Error>({
    queryKey: [contentType],
    queryFn: async () => {
      const response = await fetchWithAuth<T[]>(`${contentType}`, {
        method: "GET",
      });
      return response;
    },
  });

  // Mutation pour créer un nouvel élément
  const createMutation = useMutation({
    mutationFn: (newData: T) =>
      fetchWithAuth<T>(`${contentType}`, {
        method: "POST",
        body: JSON.stringify(newData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setIsFormOpen(false);
      setNotification({
        open: true,
        message: "Contenu créé avec succès",
        severity: "success",
      });
    },
    onError: (error: Error) => {
      setNotification({
        open: true,
        message: error.message || "Erreur lors de la création",
        severity: "error",
      });
    },
  });

  // Mutation pour mettre à jour un élément existant
  const updateMutation = useMutation({
    mutationFn: (updatedData: T) =>
      fetchWithAuth<T>(`${contentType}/${updatedData.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setIsFormOpen(false);
      setNotification({
        open: true,
        message: "Contenu mis à jour avec succès",
        severity: "success",
      });
    },
    onError: (error: Error) => {
      setNotification({
        open: true,
        message: error.message || "Erreur lors de la mise à jour",
        severity: "error",
      });
    },
  });

  // Mutation pour supprimer un élément
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      fetchWithAuth<void>(`${contentType}/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setIsDeleteOpen(false);
      setNotification({
        open: true,
        message: "Contenu supprimé avec succès",
        severity: "success",
      });
    },
    onError: (error: Error) => {
      setNotification({
        open: true,
        message: error.message || "Erreur lors de la suppression",
        severity: "error",
      });
    },
  });

  // Gestion de la modification
  const handleEdit = (item: T) => {
    setCurrentItem(item);
    setIsFormOpen(true);
  };

  // Gestion de la suppression
  const handleDelete = (item: T) => {
    setCurrentItem(item);
    setIsDeleteOpen(true);
  };

  // Soumission du formulaire (créer ou mettre à jour)
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}>
        <Typography variant="h5" component="div">
          Gestion des{" "}
          {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentItem(null);
            setIsFormOpen(true);
          }}>
          Créer Nouveau
        </Button>
      </Box>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error.message}</Typography>
      ) : (
        <DataTable
          columns={columns}
          data={data || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <FormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentItem || undefined}
        title={
          currentItem
            ? `Modifier ${contentType.slice(0, -1)}`
            : `Créer ${contentType.slice(0, -1)}`
        }
        fields={fields}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={
          currentItem ? currentItem.name || `ID: ${currentItem.id}` : ""
        }
      />
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification({ ...notification, open: false })}
      />
    </Box>
  );
};

export default ContentManager;
