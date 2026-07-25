import {
  ChevronDown,
} from "lucide-react";

import type {
  ChangeEvent,
} from "react";

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

interface StatusOption {
  value: OrderStatus;
  label: string;
}

const statusOptions: StatusOption[] = [
  {
    value: "PENDIENTE",
    label: "Pendiente",
  },
  {
    value: "PAGADO",
    label: "Pagado",
  },
  {
    value: "PREPARANDO",
    label: "Preparando",
  },
  {
    value: "ENVIADO",
    label: "Enviado",
  },
  {
    value: "ENTREGADO",
    label: "Entregado",
  },
  {
    value: "CANCELADO",
    label: "Cancelado",
  },
];

const statusClasses: Record<
  OrderStatus,
  string
> = {
  PENDIENTE:
    "border-amber-200 bg-amber-50 text-amber-700",

  PAGADO:
    "border-blue-200 bg-blue-50 text-blue-700",

  PREPARANDO:
    "border-violet-200 bg-violet-50 text-violet-700",

  ENVIADO:
    "border-cyan-200 bg-cyan-50 text-cyan-700",

  ENTREGADO:
    "border-[#97cf00]/30 bg-[#97cf00]/10 text-[#5f8200]",

  CANCELADO:
    "border-red-200 bg-red-50 text-red-700",
};

const isOrderStatus = (
  value: string
): value is OrderStatus => {
  return statusOptions.some(
    (option) =>
      option.value === value
  );
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

  const handleChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const nextStatus =
      event.target.value;

    if (
      isOrderStatus(
        nextStatus
      )
    ) {
      onChange(
        nextStatus
      );
    }
  };

  return (
    <div className="relative">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full cursor-pointer appearance-none rounded-xl border px-4 py-3 pr-10 text-[10px] font-black uppercase tracking-wider outline-none transition focus:ring-2 focus:ring-[#0066FF]/25 disabled:cursor-not-allowed disabled:opacity-60 ${statusClasses[currentStatus]}`}
      >
        {statusOptions.map(
          (option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          )
        )}
      </select>

      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 opacity-60"
      />
    </div>
  );
};

export default OrderStatusSelect;