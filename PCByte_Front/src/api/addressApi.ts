import api from "./axios";

import type {
  Address,
} from "../types/types";

export interface CreateAddressRequest {
  label?: string;
  street: string;
  number: string;
  apartment?: string | null;
  city: string;
  region: string;
  extraInfo?: string | null;
  defaultAddress?: boolean;
}

export async function getUserAddresses(
  userId: number
): Promise<Address[]> {
  const response =
    await api.get<Address[]>(
      `/addresses/user/${userId}`
    );

  return response.data;
}

export async function createUserAddress(
  userId: number,
  request: CreateAddressRequest
): Promise<Address> {
  const response =
    await api.post<Address>(
      `/addresses/user/${userId}`,
      request
    );

  return response.data;
}