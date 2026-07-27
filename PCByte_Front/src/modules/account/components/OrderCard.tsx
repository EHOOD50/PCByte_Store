import {
  CalendarDays,
  ChevronRight,
  CreditCard,
  Package,
} from "lucide-react";

interface OrderCardProps {
  id: number;
  status: string;
  createdAt: string;
  total: number;
  totalItems: number;
  onViewDetail: () => void;
}

interface OrderStatusStyle {
  label: string;
  badge: string;
  dot: string;
}

const STATUS_STYLES: Record<
  string,
  OrderStatusStyle
> = {
  PENDIENTE: {
    label: "Pendiente",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },

  PAGADO: {
    label: "Pagado",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },

  PREPARANDO: {
    label: "Preparando",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },

  ENVIADO: {
    label: "Enviado",
    badge:
      "border-sky-200 bg-sky-50 text-sky-700",
    dot: "bg-sky-500",
  },

  ENTREGADO: {
    label: "Entregado",
    badge:
      "border-violet-200 bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },

  CANCELADO: {
    label: "Cancelado",
    badge:
      "border-red-200 bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
};

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

const OrderCard = ({
  id,
  status,
  createdAt,
  total,
  totalItems,
  onViewDetail,
}: OrderCardProps) => {
  const normalizedStatus =
    status.trim().toUpperCase();

  const statusStyle =
    STATUS_STYLES[
      normalizedStatus
    ] ?? {
      label: status,
      badge:
        "border-slate-200 bg-slate-100 text-slate-700",
      dot: "bg-slate-400",
    };

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#0066FF]/25 hover:shadow-md">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Pedido #{id}
            </p>

            <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">
              Compra registrada
            </h3>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${statusStyle.badge}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${statusStyle.dot}`}
            />

            {statusStyle.label}
          </span>
        </div>

        <div className="grid gap-3 border-y border-slate-200 py-4 sm:grid-cols-3">
          <OrderInformation
            icon={
              <CalendarDays
                size={17}
              />
            }
            label="Fecha"
            value={createdAt}
          />

          <OrderInformation
            icon={
              <Package
                size={17}
              />
            }
            label="Productos"
            value={`${totalItems} ${
              totalItems === 1
                ? "producto"
                : "productos"
            }`}
          />

          <OrderInformation
            icon={
              <CreditCard
                size={17}
              />
            }
            label="Total"
            value={formatCurrency(
              total
            )}
            emphasized
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onViewDetail}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black text-[#0066FF] transition hover:bg-[#0066FF]/10 hover:text-[#004fc5]"
          >
            Ver detalle

            <ChevronRight
              size={16}
            />
          </button>
        </div>
      </div>
    </article>
  );
};

interface OrderInformationProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  emphasized?: boolean;
}

const OrderInformation = ({
  icon,
  label,
  value,
  emphasized = false,
}: OrderInformationProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 truncate text-sm ${
            emphasized
              ? "font-black text-slate-900"
              : "font-bold text-slate-700"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;