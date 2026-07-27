import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getUserAddresses,
} from "../api/addressApi";

import type {
  Address,
} from "../types/types";

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

  /*
   * Cuando silent es true, actualiza las direcciones
   * sin reemplazar la cuadrícula por el panel de carga.
   *
   * Esto evita saltos visuales después de crear,
   * editar, eliminar o cambiar la predeterminada.
   */
  const reloadAddresses =
    useCallback(
      async (
        silent = false
      ) => {
        if (!userId) {
          setAddresses([]);
          setLoading(false);
          setError(null);
          return;
        }

        try {
          if (!silent) {
            setLoading(true);
          }

          setError(null);

          const response =
            await getUserAddresses(
              userId
            );

          setAddresses(response);
        } catch (err) {
          console.error(
            "No fue posible obtener las direcciones:",
            err
          );

          setError(
            "No fue posible obtener las direcciones."
          );
        } finally {
          if (!silent) {
            setLoading(false);
          }
        }
      },
      [
        userId,
      ]
    );

  useEffect(() => {
    void reloadAddresses();
  }, [
    reloadAddresses,
  ]);

  return {
    addresses,
    loading,
    error,
    reloadAddresses,
  };
}