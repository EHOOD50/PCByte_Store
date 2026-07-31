import api from "./axios";

import type {
  OrderResponse,
} from "../modules/account/types/account";

export interface RetryPaymentResponse {
  checkoutUrl?: string;
  orderId?: number;
}

/*
 * Crea una nueva preferencia de Mercado Pago
 * para una orden pendiente ya existente.
 *
 * No genera una orden nueva.
 */
export const retryOrderPayment = async (
  orderId: number
): Promise<RetryPaymentResponse> => {
  if (
    !Number.isInteger(orderId) ||
    orderId <= 0
  ) {
    throw new Error(
      "El número de orden no es válido."
    );
  }

  const response =
    await api.post<RetryPaymentResponse>(
      `/payments/order/${orderId}/retry`
    );

  return response.data;
};

/*
 * Cancela una orden del cliente.
 *
 * El backend solo permite cancelar órdenes
 * que todavía se encuentran PENDIENTES.
 */
export const cancelCustomerOrder = async (
  orderId: number
): Promise<OrderResponse> => {
  if (
    !Number.isInteger(orderId) ||
    orderId <= 0
  ) {
    throw new Error(
      "El número de orden no es válido."
    );
  }

  const response =
    await api.patch<OrderResponse>(
      `/orders/${orderId}/cancel`
    );

  return response.data;
};