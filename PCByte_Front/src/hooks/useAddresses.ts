import { useCallback, useEffect, useState } from "react";

import { getUserAddresses } from "../api/addressApi";

import type { Address } from "../types/types";

export function useAddresses(
  userId?: number
) {
  const [
    addresses,
    setAddresses,
  ] = useState<Address[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const reloadAddresses =
    useCallback(async () => {
      if (!userId) {
        setAddresses([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response =
          await getUserAddresses(
            userId
          );

        setAddresses(response);
      } catch (err) {
        console.error(err);

        setError(
          "No fue posible obtener las direcciones."
        );
      } finally {
        setLoading(false);
      }
    }, [userId]);

  useEffect(() => {
    reloadAddresses();
  }, [reloadAddresses]);

  return {
    addresses,
    loading,
    error,
    reloadAddresses,
  };
}