"use client";

import { useToast } from "@/app/context/ToastContext";
import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { useCallback, useEffect, useState } from "react";

interface UseContentManagerOptions {
  endpoint: string;
  onError?: (error: Error) => void;
}

export const useContentManager = <T>({
  endpoint,
  onError,
}: UseContentManagerOptions) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth<T[]>(endpoint);
      setData(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
      onError?.(err as Error);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [endpoint, onError, showToast]);

  useEffect(() => {
    fetchData();
  }, [endpoint, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};
