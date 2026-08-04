import type {
  ReactNode,
} from "react";

import {
  Ban,
  CheckCircle2,
  LoaderCircle,
  PackageCheck,
  Send,
  XCircle,
} from "lucide-react";

import type {
  OrderStatus,
} from "./OrderStatusBadge";

interface OrderStatusSelectProps {
  value?: string | null;

  onChange: (
    status: OrderStatus
  ) => void;

  disabled?: boolean;
}

interface StatusAction {
  nextStatus: OrderStatus;
  label: string;
  helperText: string;
  className: string;
  icon: ReactNode;
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDIENTE",
  "PAGADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

const isOrderStatus = (
  value: string
): value is OrderStatus => {
  return ORDER_STATUSES.includes(
    value as OrderStatus
  );
};

const getStatusAction = (
  status: OrderStatus
): StatusAction | null => {
  switch (status) {
    case "PENDIENTE":
      return {
        nextStatus: "CANCELADO",
        label: "Cancelar",
        helperText:
          "Cancelar pedido pendiente",
        className:
          "border-red-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white",
        icon: <Ban size={14} />,
      };

    case "PAGADO":
      return {
        nextStatus: "PREPARANDO",
        label: "Preparar",
        helperText:
          "Marcar como preparando",
        className:
          "border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-600 hover:text-white",
        icon: (
          <PackageCheck
            size={14}
          />
        ),
      };

    case "PREPARANDO":
      return {
        nextStatus: "ENVIADO",
        label: "Enviar",
        helperText:
          "Marcar como enviado",
        className:
          "border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-600 hover:text-white",
        icon: <Send size={14} />,
      };

    case "ENVIADO":
      return {
        nextStatus: "ENTREGADO",
        label: "Entregar",
        helperText:
          "Marcar como entregado",
        className:
          "border-[#97cf00]/30 bg-[#97cf00]/10 text-[#5f8200] hover:bg-[#97cf00] hover:text-[#08101d]",
        icon: (
          <CheckCircle2
            size={14}
          />
        ),
      };

    case "ENTREGADO":
    case "CANCELADO":
      return null;
  }
};

const OrderStatusSelect = ({
  value,
  onChange,
  disabled = false,
}: OrderStatusSelectProps) => {
  const normalizedValue =
    value?.trim().toUpperCase() ??
    "PENDIENTE";

  const currentStatus: OrderStatus =
    isOrderStatus(
      normalizedValue
    )
      ? normalizedValue
      : "PENDIENTE";

  const action =
    getStatusAction(
      currentStatus
    );

  if (!action) {
    const isDelivered =
      currentStatus ===
      "ENTREGADO";

    return (
      <div
        className={`inline-flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 ${
          isDelivered
            ? "border-[#97cf00]/30 bg-[#97cf00]/10 text-[#5f8200]"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {isDelivered ? (
          <CheckCircle2
            size={14}
            className="shrink-0"
          />
        ) : (
          <XCircle
            size={14}
            className="shrink-0"
          />
        )}

        <p className="truncate text-[8px] font-black uppercase tracking-wider">
          {isDelivered
            ? "Finalizado"
            : "Cancelado"}
        </p>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      title={
        action.helperText
      }
      onClick={() =>
        onChange(
          action.nextStatus
        )
      }
      className={`inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-2 text-[8px] font-black uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
    >
      {disabled ? (
        <LoaderCircle
          size={14}
          className="animate-spin"
        />
      ) : (
        action.icon
      )}

      {disabled
        ? "Actualizando"
        : action.label}
    </button>
  );
};

export default OrderStatusSelect;