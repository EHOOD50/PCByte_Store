import { useCallback, useEffect, useState } from "react";

import {
  getShippingRates,
  createShippingRate,
  updateShippingRate,
  deleteShippingRate,
  changeShippingRateStatus,
} from "../api/shippingApi";

import type { ShippingRate } from "../types/shipping";

export const useShippingRates = () => {
  const [shippingRates, setShippingRates] = useState<
    ShippingRate[]
  >([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadShippingRates =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getShippingRates();

        setShippingRates(data);
      } catch {
        setError(
          "No se pudieron cargar las tarifas de despacho."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadShippingRates();
  }, [loadShippingRates]);

  const createRate = async (
    rate: ShippingRate
  ) => {
    await createShippingRate(rate);

    await loadShippingRates();
  };

  const updateRate = async (
    id: number,
    rate: ShippingRate
  ) => {
    await updateShippingRate(
      id,
      rate
    );

    await loadShippingRates();
  };

  const deleteRate = async (
    id: number
  ) => {
    await deleteShippingRate(id);

    await loadShippingRates();
  };

  const toggleStatus = async (
    id: number,
    active: boolean
  ) => {
    await changeShippingRateStatus(
      id,
      active
    );

    await loadShippingRates();
  };

  return {
    shippingRates,
    loading,
    error,
    loadShippingRates,
    createRate,
    updateRate,
    deleteRate,
    toggleStatus,
  };
};