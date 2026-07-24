import {
  ArrowRight,
  Clock3,
} from "lucide-react";

import type {
  AdminDashboardLatestOrder,
} from "../../../types/adminDashboard";

interface LatestOrdersCardProps {
  orders:
    | AdminDashboardLatestOrder[]
    | null;
}

const formatCurrency = (
  value: number
) => {
  return new Intl.NumberFormat(
    "es-CL",
    {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }
  ).format(value);
};

const getStatusStyle = (
  status: string
) => {
  switch (status) {
    case "PENDIENTE":
      return "bg-amber-100 text-amber-700";

    case "PAGADO":
      return "bg-green-100 text-green-700";

    case "ENVIADO":
      return "bg-blue-100 text-blue-700";

    case "ENTREGADO":
      return "bg-[#97cf00]/15 text-[#5f8200]";

    default:
      return "bg-slate-100 text-slate-600";
  }
};

const LatestOrdersCard = ({
  orders,
}: LatestOrdersCardProps) => {
  const visibleOrders =
    orders?.slice(0, 5) ?? [];

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Actividad reciente
          </p>

          <h3 className="mt-1 text-xl font-black text-slate-900">
            Últimos pedidos
          </h3>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-2 text-xs font-black text-white transition hover:brightness-110"
        >
          Ver todos
          <ArrowRight size={16} />
        </button>
      </div>

      {visibleOrders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm font-black text-slate-700">
            No hay pedidos registrados
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Los pedidos nuevos aparecerán aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visibleOrders.map(
            (order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-[#0066FF]/30 hover:bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900">
                    Pedido #{order.id}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {order.customerName}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-slate-900">
                    {formatCurrency(
                      order.total
                    )}
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-3">
        <Clock3
          size={16}
          className="text-slate-500"
        />

        <p className="text-xs text-slate-500">
          Información obtenida directamente desde el sistema de pedidos.
        </p>
      </div>
    </article>
  );
};

export default LatestOrdersCard;