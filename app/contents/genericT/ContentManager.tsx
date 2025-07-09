import DataTable from "@/app/components/DataTable";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import FormModal from "@/app/components/FormModal";
import Notification from "@/app/components/Notification";
import { Column, Field } from "@/app/types/content";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ContentManagerProps<T extends { id: number; createdAt?: string }, U> {
  contentType: string;
  columns: Column<T>[];
  fields: Field<U>[];
  transformData?: (data: T) => U;
}

// Helper pour omettre des clés d'un objet
function omitKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const clone = { ...obj };
  keys.forEach((key) => {
    delete clone[key];
  });
  return clone;
}

const ContentManager = <
  T extends { id: number; createdAt?: string },
  U extends object
>({
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
      severity: "success" | "error" | "warning" | "info";
    };
  }>({
    isFormOpen: false,
    isDeleteOpen: false,
    currentItem: null,
    notification: { open: false, message: "", severity: "success" },
  });

  const { isFormOpen, isDeleteOpen, currentItem, notification } = state;

  const setNotification = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setState((prev) => ({
      ...prev,
      notification: { open: true, message, severity },
    }));
  };

  const { data, error, isLoading } = useQuery<T[], Error>({
    queryKey: [contentType],
    queryFn: async () =>
      fetchWithAuth<T[]>(`${contentType}`, { method: "GET" }),
  });

  const mutationHandler = (
    method: "POST" | "PUT" | "DELETE",
    url: string,
    payload?: Partial<T> | U
  ) => {
    if (payload) {
      console.log("Sending data to backend:", JSON.stringify(payload, null, 2));
    }
    return fetchWithAuth<T | void>(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
    });
  };

  const createMutation = useMutation({
    mutationFn: (newData: U) =>
      mutationHandler("POST", contentType, newData as unknown as Partial<T>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setState((prev) => ({ ...prev, isFormOpen: false }));
      setNotification("Contenu créé avec succès", "success");
    },
    onError: (error: Error) =>
      setNotification(error.message || "Erreur lors de la création", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: (updatedData: U) =>
      // On récupère l'id depuis currentItem pour l'URL, pas dans le payload
      mutationHandler("PUT", `${contentType}/${currentItem?.id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setState((prev) => ({ ...prev, isFormOpen: false }));
      setNotification("Contenu mis à jour avec succès", "success");
    },
    onError: (error: Error) =>
      setNotification(
        error.message || "Erreur lors de la mise à jour",
        "error"
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      mutationHandler("DELETE", `${contentType}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setState((prev) => ({ ...prev, isDeleteOpen: false }));
      setNotification("Contenu supprimé avec succès", "success");
    },
    onError: (error: Error) =>
      setNotification(
        error.message || "Erreur lors de la suppression",
        "error"
      ),
  });

  const handleEdit = (item: T) =>
    setState((prev) => ({ ...prev, currentItem: item, isFormOpen: true }));
  const handleDelete = (item: T) =>
    setState((prev) => ({ ...prev, currentItem: item, isDeleteOpen: true }));

  // handleSubmit reçoit maintenant un payload propre (U)
  const handleSubmit = (data: Partial<U>) => {
    if (!transformData) {
      throw new Error(
        "Vous devez fournir une fonction transformData pour nettoyer le payload avant l'envoi au backend."
      );
    }
    // Toujours appliquer transformData pour convertir les types (ex: string -> number)
    // On caste data en T via unknown pour satisfaire TypeScript
    const payload = transformData(data as unknown as T);
    // On filtre les champs interdits
    const cleanPayload = omitKeys(payload, [
      "id",
      "createdAt",
      "updatedAt",
    ] as (keyof U)[]);
    console.log("Payload envoyé au backend :", cleanPayload);
    if (currentItem) {
      updateMutation.mutate(cleanPayload as U);
    } else {
      createMutation.mutate(cleanPayload as U);
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
        mb={2}
      >
        <Typography variant="h5" component="div">
          Gestion des{" "}
          {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            setState((prev) => ({
              ...prev,
              currentItem: null,
              isFormOpen: true,
            }))
          }
        >
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
      {/* FormModal reçoit initialData déjà transformé (T -> U) */}
      <FormModal
        open={isFormOpen}
        onClose={() => {
          setState((prev) => ({ ...prev, isFormOpen: false }));
          setState((prev) => ({ ...prev, currentItem: null }));
        }}
        onSubmit={handleSubmit}
        initialData={
          currentItem && transformData
            ? transformData(
                omitKeys(currentItem, [
                  "id",
                  "createdAt",
                  "updatedAt",
                  "name",
                ] as (keyof T)[]) as unknown as T
              )
            : undefined
        }
        title={
          currentItem
            ? `Modifier ${contentType.slice(0, -1)}`
            : `Créer ${contentType.slice(0, -1)}`
        }
        fields={fields}
        mode={currentItem ? "edit" : "create"}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onClose={() => setState((prev) => ({ ...prev, isDeleteOpen: false }))}
        onConfirm={handleConfirmDelete}
        itemName={
          currentItem
            ? (currentItem as unknown as { title?: string }).title ||
              `ID: ${currentItem.id}`
            : ""
        }
      />
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() =>
          setState((prev) => ({
            ...prev,
            notification: { ...prev.notification, open: false },
          }))
        }
      />
    </Box>
  );
};

export default ContentManager;
