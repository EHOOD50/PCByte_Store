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
 * Obtiene todas las direcciones del usuario autenticado.
 *
 * El backend determina al propietario mediante
 * las credenciales HTTP Basic.
 */
export async function getUserAddresses(): Promise<
  Address[]
> {
  const response =
    await api.get<Address[]>(
      "/addresses"
    );

  return response.data;
}

/*
 * Crea una dirección para el usuario autenticado.
 */
export async function createUserAddress(
  request: AddressRequest
): Promise<Address> {
  const response =
    await api.post<Address>(
      "/addresses",
      request
    );

  return response.data;
}

/*
 * Actualiza una dirección perteneciente
 * al usuario autenticado.
 */
export async function updateUserAddress(
  addressId: number,
  request: AddressRequest
): Promise<Address> {
  validateAddressId(
    addressId
  );

  const response =
    await api.put<Address>(
      `/addresses/${addressId}`,
      request
    );

  return response.data;
}

/*
 * Marca una dirección del usuario autenticado
 * como predeterminada.
 */
export async function setDefaultUserAddress(
  addressId: number
): Promise<Address> {
  validateAddressId(
    addressId
  );

  const response =
    await api.patch<Address>(
      `/addresses/${addressId}/default`
    );

  return response.data;
}

/*
 * Elimina una dirección perteneciente
 * al usuario autenticado.
 */
export async function deleteUserAddress(
  addressId: number
): Promise<void> {
  validateAddressId(
    addressId
  );

  await api.delete(
    `/addresses/${addressId}`
  );
}

/*
 * Alias mantenido para no romper imports anteriores.
 */
export type CreateAddressRequest =
  AddressRequest;

function validateAddressId(
  addressId: number
): void {
  if (
    !Number.isInteger(
      addressId
    ) ||
    addressId <= 0
  ) {
    throw new Error(
      "El identificador de la dirección no es válido."
    );
  }
}