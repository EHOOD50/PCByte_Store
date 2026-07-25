import {
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  PackageCheck,
  PackageOpen,
  Truck,
  XCircle,
} from "lucide-react";

export type OrderStatus =
  | "PENDIENTE"
  | "PAGADO"
  | "PREPARANDO"
  | "ENVIADO"
  | "ENTREGADO"
  | "CANCELADO";

interface OrderStatusBadgeProps {
  status?: string | null;
  compact?: boolean;
}

interface StatusConfig {
  label: string;
  className: string;
  icon: typeof Clock3;
}

const statusConfig: Record<
  OrderStatus,
  StatusConfig
> = {
  PENDIENTE: {
    label: "Pendiente",
    className:
      "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock3,
  },

  PAGADO: {
    label: "Pagado",
    className:
      "border-blue-200 bg-blue-50 text-blue-700",
    icon: CircleDollarSign,
  },

  PREPARANDO: {
    label: "Preparando",
    className:
      "border-violet-200 bg-violet-50 text-violet-700",
    icon: PackageOpen,
  },

  ENVIADO: {
    label: "Enviado",
    className:
      "border-cyan-200 bg-cyan-50 text-cyan-700",
    icon: Truck,
  },

  ENTREGADO: {
    label: "Entregado",
    className:
      "border-[#97cf00]/30 bg-[#97cf00]/10 text-[#5f8200]",
    icon: PackageCheck,
  },

  CANCELADO: {
    label: "Cancelado",
    className:
      "border-red-200 bg-red-50 text-red-700",
    icon: XCircle,
  },
};

const isOrderStatus = (
  value: string
): value is OrderStatus => {
  return value in statusConfig;
};

const OrderStatusBadge = ({
  status,
  compact = false,
}: OrderStatusBadgeProps) => {
  const normalizedStatus =
    status?.trim().toUpperCase() ?? "";

  const config = isOrderStatus(
    normalizedStatus
  )
    ? statusConfig[normalizedStatus]
    : {
        label:
          normalizedStatus ||
          "Sin estado",
        className:
          "border-slate-200 bg-slate-100 text-slate-600",
        icon: CheckCircle2,
      };

  const StatusIcon = config.icon;

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border font-black uppercase tracking-wider ${config.className} ${
        compact
          ? "gap-1.5 px-2.5 py-1 text-[8px]"
          : "gap-2 px-3 py-1.5 text-[9px]"
      }`}
    >
      <StatusIcon
        size={compact ? 12 : 14}
      />

      {config.label}
    </span>
  );
};

export default OrderStatusBadge;