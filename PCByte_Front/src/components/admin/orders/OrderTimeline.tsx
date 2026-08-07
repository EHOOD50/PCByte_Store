import {
  Check,
  CircleDollarSign,
  Clock3,
  PackageCheck,
  PackageOpen,
  Truck,
  X,
} from "lucide-react";

import type {
  OrderStatus,
} from "./OrderStatusBadge";

interface OrderTimelineProps {
  status?: string | null;

  createdAt?: string | null;
  paidAt?: string | null;
  preparingAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
}

interface TimelineStep {
  status: Exclude<
    OrderStatus,
    "CANCELADO"
  >;

  label: string;
  description: string;
  icon: typeof Clock3;

  timestamp:
    | string
    | null
    | undefined;
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDIENTE",
  "PAGADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

const getNormalizedStatus = (
  value?: string | null
): OrderStatus => {
  const normalized =
    value
      ?.trim()
      .toUpperCase();

  if (
    normalized &&
    ORDER_STATUSES.includes(
      normalized as OrderStatus
    )
  ) {
    return normalized as OrderStatus;
  }

  return "PENDIENTE";
};

const formatTimelineDate = (
  value?: string | null
) => {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "es-CL",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};

const getElapsedTime = (
  value?: string | null
) => {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  const elapsedMilliseconds =
    Date.now() -
    date.getTime();

  if (
    elapsedMilliseconds < 0
  ) {
    return null;
  }

  const elapsedMinutes =
    Math.floor(
      elapsedMilliseconds /
        60_000
    );

  if (
    elapsedMinutes < 1
  ) {
    return "Hace unos segundos";
  }

  if (
    elapsedMinutes < 60
  ) {
    return `Hace ${elapsedMinutes} ${
      elapsedMinutes === 1
        ? "minuto"
        : "minutos"
    }`;
  }

  const elapsedHours =
    Math.floor(
      elapsedMinutes / 60
    );

  if (
    elapsedHours < 24
  ) {
    return `Hace ${elapsedHours} ${
      elapsedHours === 1
        ? "hora"
        : "horas"
    }`;
  }

  const elapsedDays =
    Math.floor(
      elapsedHours / 24
    );

  return `Hace ${elapsedDays} ${
    elapsedDays === 1
      ? "día"
      : "días"
  }`;
};

const OrderTimeline = ({
  status,
  createdAt,
  paidAt,
  preparingAt,
  shippedAt,
  deliveredAt,
  cancelledAt,
}: OrderTimelineProps) => {
  const currentStatus =
    getNormalizedStatus(
      status
    );

  if (
    currentStatus ===
    "CANCELADO"
  ) {
    const cancelledDate =
      formatTimelineDate(
        cancelledAt
      );

    const cancelledElapsed =
      getElapsedTime(
        cancelledAt
      );

    return (
      <section className="rounded-[1.4rem] border border-red-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
            <X size={17} />
          </div>

          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.17em] text-red-500">
              Línea de tiempo
            </p>

            <h3 className="mt-0.5 text-sm font-black text-slate-900">
              Pedido cancelado
            </h3>

            <p className="mt-1 text-[11px] leading-4 text-slate-500">
              El flujo operativo de este pedido fue interrumpido.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
              <X size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-[13px] font-black text-red-700">
                Cancelado
              </p>

              {cancelledDate ? (
                <>
                  <p className="mt-0.5 text-[10px] font-bold text-red-600">
                    {cancelledDate}
                  </p>

                  {cancelledElapsed && (
                    <p className="mt-0.5 text-[9px] text-red-500">
                      {cancelledElapsed}
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-0.5 text-[10px] text-red-500">
                  Fecha histórica no disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const flowSteps: TimelineStep[] = [
    {
      status: "PENDIENTE",
      label: "Pedido creado",
      description:
        "La orden fue registrada y quedó pendiente de confirmación de pago.",
      icon: Clock3,
      timestamp: createdAt,
    },
    {
      status: "PAGADO",
      label: "Pago confirmado",
      description:
        "El proveedor de pagos confirmó correctamente la transacción.",
      icon: CircleDollarSign,
      timestamp: paidAt,
    },
    {
      status: "PREPARANDO",
      label: "Preparación iniciada",
      description:
        "Los productos entraron al proceso de preparación para despacho.",
      icon: PackageOpen,
      timestamp: preparingAt,
    },
    {
      status: "ENVIADO",
      label: "Pedido enviado",
      description:
        "El pedido fue entregado al transportista.",
      icon: Truck,
      timestamp: shippedAt,
    },
    {
      status: "ENTREGADO",
      label: "Pedido entregado",
      description:
        "La entrega final al cliente fue confirmada.",
      icon: PackageCheck,
      timestamp: deliveredAt,
    },
  ];

  const currentIndex =
    flowSteps.findIndex(
      (step) =>
        step.status ===
        currentStatus
    );

  return (
    <section className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-[8px] font-black uppercase tracking-[0.17em] text-[#0066FF]">
          Línea de tiempo
        </p>

        <h3 className="mt-0.5 text-sm font-black text-slate-900">
          Historial del pedido
        </h3>

        <p className="mt-1 text-[11px] leading-4 text-slate-500">
          Fechas reales registradas durante el flujo operativo.
        </p>
      </div>

      <div className="mt-5 space-y-0">
        {flowSteps.map(
          (
            step,
            index
          ) => {
            const StepIcon =
              step.icon;

            const completed =
              index <
              currentIndex;

            const active =
              index ===
              currentIndex;

            const pending =
              index >
              currentIndex;

            const isLast =
              index ===
              flowSteps.length - 1;

            const formattedDate =
              formatTimelineDate(
                step.timestamp
              );

            const elapsedTime =
              getElapsedTime(
                step.timestamp
              );

            const shouldHaveTimestamp =
              completed ||
              active;

            return (
              <div
                key={step.status}
                className="relative flex gap-3"
              >
                {!isLast && (
                  <div
                    className={`absolute left-[17px] top-9 h-[calc(100%-1.75rem)] w-0.5 ${
                      completed
                        ? "bg-[#97cf00]"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center">
                  {active && (
                    <span className="absolute h-9 w-9 animate-ping rounded-full bg-[#0066FF]/15" />
                  )}

                  <div
                    className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                      completed
                        ? "border-[#97cf00] bg-[#97cf00] text-white"
                        : active
                          ? "border-[#0066FF] bg-[#0066FF] text-white shadow-[0_0_0_5px_rgba(0,102,255,0.10)]"
                          : "border-slate-200 bg-white text-slate-400"
                    }`}
                  >
                    {completed ? (
                      <Check
                        size={14}
                      />
                    ) : (
                      <StepIcon
                        size={14}
                      />
                    )}
                  </div>
                </div>

                <div
                  className={`min-w-0 flex-1 pb-5 ${
                    isLast
                      ? "pb-0"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-[13px] font-black ${
                        active
                          ? "text-[#0066FF]"
                          : completed
                            ? "text-slate-900"
                            : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </p>

                    {active && (
                      <span className="rounded-full bg-[#0066FF]/10 px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-[#0066FF]">
                        Estado actual
                      </span>
                    )}

                    {completed && (
                      <span className="rounded-full bg-[#97cf00]/15 px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-[#5f8200]">
                        Completado
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-1 text-[10px] leading-4 ${
                      pending
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {step.description}
                  </p>

                  {formattedDate ? (
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p
                        className={`text-[9px] font-black ${
                          active
                            ? "text-[#0066FF]"
                            : "text-slate-600"
                        }`}
                      >
                        {formattedDate}
                      </p>

                      {elapsedTime && (
                        <p className="text-[8px] font-bold text-slate-400">
                          {elapsedTime}
                        </p>
                      )}
                    </div>
                  ) : shouldHaveTimestamp ? (
                    <p className="mt-1.5 text-[8px] font-bold text-amber-500">
                      Fecha histórica no disponible
                    </p>
                  ) : null}
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
};

export default OrderTimeline;