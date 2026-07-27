import api from "../../../api/axios";

import type {
  OrderResponse,
} from "../types/account";

const BASE_URL =
  "/orders";

export const accountService = {
  async getOrders(
    userId: number
  ): Promise<OrderResponse[]> {
    const response =
      await api.get<OrderResponse[]>(
        `${BASE_URL}/user/${userId}`
      );

    return response.data;
  },
};