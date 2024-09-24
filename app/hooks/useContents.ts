import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { endpoints } from "@/app/utils/api";

export const useContents = <T extends { id: number }>(contentType: string) => {
  const queryClient = useQueryClient();

  // Utilisation de useQuery pour récupérer les contenus
  const { data, error, isLoading } = useQuery<T[], Error>({
    queryKey: [`${contentType}-contents`], // Passer un objet d'options
    queryFn: async () => {
      return await fetchWithAuth<T[]>(endpoints.contents(contentType), {
        method: "GET",
      });
    },
  });

  // Mutation pour créer un nouveau contenu
  const createContent = useMutation({
    mutationFn: (newContent: Partial<T>) =>
      fetchWithAuth<T>(endpoints.contents(contentType), {
        method: "POST",
        body: JSON.stringify(newContent),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${contentType}-contents`] }); // Invalidate queries après création
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la création du contenu :", error);
    },
  });

  // Mutation pour mettre à jour un contenu existant
  const updateContent = useMutation({
    mutationFn: (updatedContent: T) =>
      fetchWithAuth<T>(endpoints.contentById(contentType, updatedContent.id), {
        method: "PUT",
        body: JSON.stringify(updatedContent),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${contentType}-contents`] }); // Invalidate queries après mise à jour
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la mise à jour du contenu :", error);
    },
  });

  // Mutation pour supprimer un contenu
  const deleteContent = useMutation({
    mutationFn: (id: number) =>
      fetchWithAuth<void>(endpoints.contentById(contentType, id), {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${contentType}-contents`] }); // Invalidate queries après suppression
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la suppression du contenu :", error);
    },
  });

  return {
    data,
    error,
    isLoading,
    createContent,
    updateContent,
    deleteContent,
  };
};
