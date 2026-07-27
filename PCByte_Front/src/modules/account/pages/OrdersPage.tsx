import {
  useMemo,
  useState,
} from "react";

import {
  AlertCircle,
  Loader2,
  PackageSearch,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";

import OrderDetailsDrawer from "../../../components/admin/orders/OrderDetailsDrawer";

import OrderCard from "../components/OrderCard";
import useOrders from "../hooks/useOrders";

import type {
  OrderResponse,
} from "../types/account";

const formatOrderDate = (
  value: string
) => {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-CL",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(date);
};

const OrdersPage = () => {
  const {
    user,
  } = useAuth();

  const {
    orders,
    loading,
    error,
    reload,
  } = useOrders(
    user?.id
  );

  const [
    selectedOrder,
    setSelectedOrder,
  ] =
    useState<OrderResponse | null>(
      null
    );

  const orderStatistics =
    useMemo(() => {
      const totalOrders =
        orders.length;

      const inProgress =
        orders.filter(
          (order) =>
            [
              "PENDIENTE",
              "PAGADO",
              "PREPARANDO",
              "ENVIADO",
            ].includes(
              order.status
                .trim()
                .toUpperCase()
            )
        ).length;

      const delivered =
        orders.filter(
          (order) =>
            order.status
              .trim()
              .toUpperCase() ===
            "ENTREGADO"
        ).length;

      return {
        totalOrders,
        inProgress,
        delivered,
      };
    }, [
      orders,
    ]);

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Historial de compras
          </p>

          <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Mis pedidos
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Consulta el estado, la fecha y el total de tus compras realizadas en PCByte.
              </p>
            </div>

            {!loading &&
              !error &&
              orders.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <StatisticCard
                    label="Pedidos"
                    value={
                      orderStatistics
                        .totalOrders
                    }
                  />

                  <StatisticCard
                    label="En proceso"
                    value={
                      orderStatistics
                        .inProgress
                    }
                  />

                  <StatisticCard
                    label="Entregados"
                    value={
                      orderStatistics
                        .delivered
                    }
                  />
                </div>
              )}
          </div>
        </section>

        {loading && (
          <section className="flex min-h-72 items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <Loader2
                size={34}
                className="mx-auto animate-spin text-[#0066FF]"
              />

              <p className="mt-4 text-sm font-black text-slate-800">
                Cargando tus pedidos
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Estamos consultando tu historial de compras.
              </p>
            </div>
          </section>
        )}

        {!loading &&
          error && (
            <section className="rounded-[2rem] border border-red-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle
                  size={27}
                />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                No pudimos cargar tus pedidos
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  void reload();
                }}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
              >
                <RefreshCw
                  size={16}
                />

                Intentar nuevamente
              </button>
            </section>
          )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
                <PackageSearch
                  size={30}
                />
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900">
                Todavía no tienes pedidos
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Cuando realices una compra, podrás revisar aquí su estado y seguimiento.
              </p>
            </section>
          )}

        {!loading &&
          !error &&
          orders.length > 0 && (
            <section className="grid gap-5">
              {orders.map(
                (order) => (
                  <OrderCard
                    key={
                      order.id
                    }
                    id={
                      order.id
                    }
                    status={
                      order.status
                    }
                    createdAt={formatOrderDate(
                      order.createdAt
                    )}
                    total={
                      order.total
                    }
                    totalItems={(
                      order.items ??
                      []
                    ).reduce(
                      (
                        accumulator,
                        item
                      ) =>
                        accumulator +
                        item.quantity,
                      0
                    )}
                    onViewDetail={() =>
                      setSelectedOrder(
                        order
                      )
                    }
                  />
                )
              )}
            </section>
          )}
      </div>

      <OrderDetailsDrawer
        order={
          selectedOrder
        }
        isOpen={
          selectedOrder !==
          null
        }
        readonly
        title="Mi compra"
        onClose={() =>
          setSelectedOrder(
            null
          )
        }
      />
    </>
  );
};

interface StatisticCardProps {
  label: string;
  value: number;
}

const StatisticCard = ({
  label,
  value,
}: StatisticCardProps) => {
  return (
    <div className="min-w-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
      <p className="text-xl font-black text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
};

export default OrdersPage;