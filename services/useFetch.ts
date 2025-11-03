// ✅ Hook personnalisé pour gérer le fetching d'API
import { useEffect, useState } from 'react';

// <T> est un type générique : cela permet que le hook fonctionne
// avec n’importe quel type de données (film, liste, utilisateur, etc.)
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  // ✅ Les données retournées par l'API
  const [data, setData] = useState<T | null>(null);

  // ✅ Indique si la requête est en cours
  const [loading, setLoading] = useState(false);

  // ✅ Stocke une erreur si la requête échoue
  const [error, setError] = useState<Error | null>(null);

  // ✅ Fonction qui exécute réellement la requête API
  const fetchData = async () => {
    try {
      setLoading(true); // on démarre le chargement
      setError(null); // on réinitialise l’erreur

      const result = await fetchFunction(); // appel API externe

      setData(result); // stock la réponse
    } catch (err) {
      // ✅ TypeScript ne sait pas si err est vraiment une Error => sécurité
      setError(
        err instanceof Error ? err : new Error('Une erreur est survenue')
      );
    } finally {
      setLoading(false); // ✅ Qu’il y ait erreur ou succès, on arrête le loading
    }
  };

  // ✅ Permet de revenir à l'état initial
  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  // ✅ Lance automatiquement la requête à l’arrivée du composant
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  // ✅ On expose ce dont un composant aura besoin
  return {
    data, // données API
    loading, // indicateur de chargement
    error, // erreur éventuelle
    refetch: fetchData, // permet de relancer manuellement
    reset, // permet de réinitialiser
  };
};

// ✅ IMPORTANT : on exporte bien useFetch, pas useEffect
export default useFetch;
