import api from "./axios";
import type { ShippingRate } from "../types/shipping";

export const getShippingRates = async () => {
  const response = await api.get<ShippingRate[]>(
    "/admin/shipping-rates"
  );

  return response.data;
};

export const getShippingRate = async (
  id: number
) => {
  const response = await api.get<ShippingRate>(
    `/admin/shipping-rates/${id}`
  );

  return response.data;
};

export const createShippingRate = async (
  rate: ShippingRate
) => {
  const response = await api.post(
    "/admin/shipping-rates",
    rate
  );

  return response.data;
};

export const updateShippingRate = async (
  id: number,
  rate: ShippingRate
) => {
  const response = await api.put(
    `/admin/shipping-rates/${id}`,
    rate
  );

  return response.data;
};

export const deleteShippingRate = async (
  id: number
) => {
  await api.delete(
    `/admin/shipping-rates/${id}`
  );
};

export const changeShippingRateStatus = async (
  id: number,
  active: boolean
) => {
  const response = await api.patch(
    `/admin/shipping-rates/${id}/status`,
    null,
    {
      params: {
        active,
      },
    }
  );

  return response.data;
};