import type {
  OrderStatus,
} from "../components/admin/orders/OrderStatusBadge";

export type OrderPriority =
  | "NORMAL"
  | "HIGH"
  | "URGENT"
  | "WAITING_PAYMENT"
  | "IN_TRANSIT"
  | "FINISHED"
  | "NO_MANAGEMENT";

export interface OrderPriorityInfo {
  priority: OrderPriority;
  label: string;
  description: string;
  elapsedLabel: string | null;
  classes: string;
  rowClasses: string;
}

const getElapsedMilliseconds = (
  date?: string | null
) => {
  if (!date) {
    return null;
  }

  const timestamp =
    new Date(date).getTime();

  if (
    Number.isNaN(timestamp)
  ) {
    return null;
  }

  return Math.max(
    Date.now() - timestamp,
    0
  );
};

const formatElapsedTime = (
  date?: string | null
) => {
  const elapsedMilliseconds =
    getElapsedMilliseconds(date);

  if (
    elapsedMilliseconds === null
  ) {
    return null;
  }

  const totalMinutes =
    Math.floor(
      elapsedMilliseconds /
        60_000
    );

  if (totalMinutes < 1) {
    return "Hace unos segundos";
  }

  if (totalMinutes < 60) {
    return `Hace ${totalMinutes} ${
      totalMinutes === 1
        ? "minuto"
        : "minutos"
    }`;
  }

  const totalHours =
    Math.floor(
      totalMinutes / 60
    );

  const remainingMinutes =
    totalMinutes % 60;

  if (totalHours < 24) {
    if (remainingMinutes === 0) {
      return `Hace ${totalHours} ${
        totalHours === 1
          ? "hora"
          : "horas"
      }`;
    }

    return `Hace ${totalHours} h ${remainingMinutes} min`;
  }

  const totalDays =
    Math.floor(
      totalHours / 24
    );

  const remainingHours =
    totalHours % 24;

  if (remainingHours === 0) {
    return `Hace ${totalDays} ${
      totalDays === 1
        ? "día"
        : "días"
    }`;
  }

  return `Hace ${totalDays} ${
    totalDays === 1
      ? "día"
      : "días"
  } ${remainingHours} h`;
};

const getElapsedHours = (
  date?: string | null
) => {
  const elapsedMilliseconds =
    getElapsedMilliseconds(date);

  if (
    elapsedMilliseconds === null
  ) {
    return 0;
  }

  return (
    elapsedMilliseconds /
    3_600_000
  );
};

const normalizeStatus = (
  status?: string | null
): OrderStatus => {
  const normalized =
    status
      ?.trim()
      .toUpperCase();

  const validStatuses:
    OrderStatus[] = [
      "PENDIENTE",
      "PAGADO",
      "PREPARANDO",
      "ENVIADO",
      "ENTREGADO",
      "CANCELADO",
    ];

  if (
    normalized &&
    validStatuses.includes(
      normalized as OrderStatus
    )
  ) {
    return normalized as OrderStatus;
  }

  return "PENDIENTE";
};

export const getOrderPriority = (
  status?: string | null,
  paidAt?: string | null,
  preparingAt?: string | null,
  shippedAt?: string | null
): OrderPriorityInfo => {
  const normalizedStatus =
    normalizeStatus(status);

  switch (normalizedStatus) {
    case "PENDIENTE":
      return {
        priority:
          "WAITING_PAYMENT",

        label:
          "Esperando pago",

        description:
          "Aún no inicia flujo logístico.",

        elapsedLabel: null,

        classes:
          "border-slate-200 bg-slate-100 text-slate-600",

        rowClasses:
          "bg-white",
      };

    case "PAGADO": {
      const elapsedHours =
        getElapsedHours(
          paidAt
        );

      const elapsedLabel =
        formatElapsedTime(
          paidAt
        );

      if (elapsedHours >= 8) {
        return {
          priority:
            "URGENT",

          label:
            "Urgente",

          description:
            "Debe prepararse inmediatamente.",

          elapsedLabel,

          classes:
            "border-red-200 bg-red-50 text-red-700",

          rowClasses:
            "bg-red-50/35 hover:bg-red-50/60",
        };
      }

      if (elapsedHours >= 2) {
        return {
          priority:
            "HIGH",

          label:
            "Alta",

          description:
            "Conviene prepararlo pronto.",

          elapsedLabel,

          classes:
            "border-amber-200 bg-amber-50 text-amber-700",

          rowClasses:
            "bg-amber-50/30 hover:bg-amber-50/55",
        };
      }

      return {
        priority:
          "NORMAL",

        label:
          "A tiempo",

        description:
          "Dentro del tiempo esperado.",

        elapsedLabel,

        classes:
          "border-[#97cf00]/30 bg-[#97cf00]/10 text-[#5f8200]",

        rowClasses:
          "bg-white hover:bg-[#0066FF]/[0.035]",
      };
    }

    case "PREPARANDO": {
      const elapsedHours =
        getElapsedHours(
          preparingAt
        );

      const elapsedLabel =
        formatElapsedTime(
          preparingAt
        );

      if (elapsedHours >= 4) {
        return {
          priority:
            "HIGH",

          label:
            "Revisar",

          description:
            "Preparación sobre el tiempo esperado.",

          elapsedLabel,

          classes:
            "border-amber-200 bg-amber-50 text-amber-700",

          rowClasses:
            "bg-amber-50/30 hover:bg-amber-50/55",
        };
      }

      return {
        priority:
          "NORMAL",

        label:
          "En preparación",

        description:
          "Proceso dentro del tiempo esperado.",

        elapsedLabel,

        classes:
          "border-violet-200 bg-violet-50 text-violet-700",

        rowClasses:
          "bg-white hover:bg-violet-50/30",
      };
    }

    case "ENVIADO":
      return {
        priority:
          "IN_TRANSIT",

        label:
          "En ruta",

        description:
          "El pedido ya fue despachado.",

        elapsedLabel:
          formatElapsedTime(
            shippedAt
          ),

        classes:
          "border-cyan-200 bg-cyan-50 text-cyan-700",

        rowClasses:
  "bg-cyan-50/35 hover:bg-cyan-50/60",
      };

    case "ENTREGADO":
      return {
        priority:
          "FINISHED",

        label:
          "Finalizado",

        description:
          "Proceso completado.",

        elapsedLabel: null,

        classes:
          "border-[#97cf00]/30 bg-[#97cf00]/10 text-[#5f8200]",

        rowClasses:
  "bg-[#97cf00]/[0.04] hover:bg-[#97cf00]/[0.08]",
      };

    case "CANCELADO":
      return {
        priority:
          "NO_MANAGEMENT",

        label:
          "Sin gestión",

        description:
          "La orden no requiere acciones.",

        elapsedLabel: null,

        classes:
          "border-slate-200 bg-slate-100 text-slate-500",

        rowClasses:
          "bg-slate-50/45 hover:bg-slate-100/60",
      };
  }
};