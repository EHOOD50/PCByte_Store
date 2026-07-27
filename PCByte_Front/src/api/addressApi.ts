import api from "./axios";

import type {
  Address,
} from "../types/types";

export interface AddressRequest {
  label?: string;

  street: string;
  number: string;

  apartment?: string | null;

  city: string;
  region: string;

  extraInfo?: string | null;

  defaultAddress?: boolean;
}

/*
 * Obtiene todas las direcciones del cliente.
 */
export async function getUserAddresses(
  userId: number
): Promise<Address[]> {
  const response =
    await api.get<Address[]>(
      `/addresses/user/${userId}`
    );

  return response.data;
}

/*
 * Crea una dirección para el cliente.
 */
export async function createUserAddress(
  userId: number,
  request: AddressRequest
): Promise<Address> {
  const response =
    await api.post<Address>(
      `/addresses/user/${userId}`,
      request
    );

  return response.data;
}

/*
 * Actualiza una dirección existente.
 */
export async function updateUserAddress(
  userId: number,
  addressId: number,
  request: AddressRequest
): Promise<Address> {
  const response =
    await api.put<Address>(
      `/addresses/user/${userId}/${addressId}`,
      request
    );

  return response.data;
}

/*
 * Marca una dirección como predeterminada.
 */
export async function setDefaultUserAddress(
  userId: number,
  addressId: number
): Promise<Address> {
  const response =
    await api.patch<Address>(
      `/addresses/user/${userId}/${addressId}/default`
    );

  return response.data;
}

/*
 * Elimina una dirección.
 */
export async function deleteUserAddress(
  userId: number,
  addressId: number
): Promise<void> {
  await api.delete(
    `/addresses/user/${userId}/${addressId}`
  );
}

/*
 * Alias mantenido para no romper imports anteriores.
 */
export type CreateAddressRequest =
  AddressRequest;