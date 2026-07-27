import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { accountService } from "../api/accountService";

import type {
  OrderResponse,
} from "../types/account";

interface UseOrdersResult {
  orders: OrderResponse[];
  loading: boolean;
  error: string;
  reload: () => Promise<void>;
}

const useOrders = (
  userId: number | null | undefined
): UseOrdersResult => {
  const [
    orders,
    setOrders,
  ] = useState<OrderResponse[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const loadOrders =
    useCallback(async () => {
      if (!userId) {
        setOrders([]);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response =
          await accountService.getOrders(
            userId
          );

        setOrders(response);
      } catch (requestError) {
        console.error(
          "No fue posible cargar los pedidos del cliente:",
          requestError
        );

        setOrders([]);

        setError(
          "No fue posible cargar tus pedidos. Intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    }, [
      userId,
    ]);

  useEffect(() => {
    void loadOrders();
  }, [
    loadOrders,
  ]);

  return {
    orders,
    loading,
    error,
    reload: loadOrders,
  };
};

export default useOrders;