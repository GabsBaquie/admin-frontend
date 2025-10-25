import { fetchWithAuth } from "@/app/utils/fetchWithAuth";
import { useCallback, useEffect, useState } from "react";

interface UseApiDataOptions<T> {
  endpoint: string;
  initialData?: T[];
  onError?: (error: Error) => void;
}

export const useApiData = <T>({
  endpoint,
  initialData = [],
  onError,
}: UseApiDataOptions<T>) => {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchWithAuth<T[]>(endpoint);
      setData(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, onError]);

  useEffect(() => {
    fetchData();
  }, [endpoint, fetchData]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
    setData,
  };
};
