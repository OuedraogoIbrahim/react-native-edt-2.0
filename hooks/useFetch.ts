import { useState, useEffect, useCallback } from "react";

// Typage générique pour les données retournées par l'API
const useFetch = <T>(
  apiFunction: (...args: any[]) => Promise<T>,
  params: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les données
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiFunction(...params);
      setData(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, ...params]); // Dépendances dans useCallback

  // Gestion de l'effet avec annulation
  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      if (isMounted) {
        await fetchData();
      }
    };

    executeFetch();

    // Cleanup pour éviter les mises à jour d'état sur un composant démonté
    return () => {
      isMounted = false;
    };
  }, [fetchData]); // fetchData est stable grâce à useCallback

  // Retour avec une fonction pour relancer manuellement
  return { data, loading, error, refetch: fetchData };
};

export default useFetch;