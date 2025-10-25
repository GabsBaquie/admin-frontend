"use client";

import DataTable from "@/app/components/DataTable";
import DeleteConfirmation from "@/app/components/DeleteConfirmation";
import FormModal from "@/app/components/FormModal";
import Notification from "@/app/components/common/Notification";
import { Column, Field } from "@/app/types/content";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { uploadImage } from "@/app/utils/imageUpload";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ContentManagerProps<T extends { id: number; createdAt?: string }, U> {
  contentType: string;
  columns: Column<T>[];
  fields: Field<U>[];
  transformData?: (data: T) => U;
}

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

  const mutationHandler = async (
    method: "POST" | "PUT" | "DELETE",
    url: string,
    payload?: Partial<T> | U
  ) => {
    let body: BodyInit | undefined;
    const headers: Record<string, string> = {};

    if (payload) {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    return fetchWithAuth<T | void>(url, {
      method,
      headers,
      body,
    });
  };

  const createMutation = useMutation({
    mutationFn: async ({ data }: { data: U }) =>
      mutationHandler("POST", contentType, data as unknown as Partial<T>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [contentType] });
      setState((prev) => ({ ...prev, isFormOpen: false }));
      setNotification("Contenu créé avec succès", "success");
    },
    onError: (error: Error) =>
      setNotification(error.message || "Erreur lors de la création", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ data }: { data: U }) =>
      mutationHandler("PUT", `${contentType}/${currentItem?.id}`, data),
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

  const handleSubmit = async (data: Partial<U>, imageFile?: File) => {
    const cleanPayload = omitKeys(
      data as U,
      ["id", "createdAt", "updatedAt"] as (keyof U)[]
    );

    let imageUrl: string | undefined;
    if (imageFile) {
      try {
        imageUrl = await uploadImage(imageFile);
      } catch (error) {
        console.error("Erreur lors de l'upload de l'image:", error);
        setNotification("Erreur lors de l'upload de l'image", "error");
        return;
      }
    }

    const finalPayload = imageUrl
      ? { ...cleanPayload, image: imageUrl }
      : cleanPayload;

    if (currentItem) {
      updateMutation.mutate({ data: finalPayload as U });
    } else {
      createMutation.mutate({ data: finalPayload as U });
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
          currentItem
            ? (omitKeys(currentItem, [
                "id",
                "createdAt",
                "updatedAt",
                "name",
              ] as (keyof T)[]) as unknown as U)
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
