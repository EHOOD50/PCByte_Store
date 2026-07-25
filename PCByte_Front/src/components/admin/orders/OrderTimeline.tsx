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
}

interface TimelineStep {
  status: Exclude<
    OrderStatus,
    "CANCELADO"
  >;
  label: string;
  description: string;
  icon: typeof Clock3;
}

const FLOW_STEPS: TimelineStep[] = [
  {
    status: "PENDIENTE",
    label: "Pendiente",
    description:
      "El pedido fue creado y espera confirmación de pago.",
    icon: Clock3,
  },
  {
    status: "PAGADO",
    label: "Pagado",
    description:
      "El pago fue confirmado correctamente.",
    icon: CircleDollarSign,
  },
  {
    status: "PREPARANDO",
    label: "Preparando",
    description:
      "Los productos están siendo preparados para despacho.",
    icon: PackageOpen,
  },
  {
    status: "ENVIADO",
    label: "Enviado",
    description:
      "El pedido fue entregado al transporte.",
    icon: Truck,
  },
  {
    status: "ENTREGADO",
    label: "Entregado",
    description:
      "El pedido fue recibido por el cliente.",
    icon: PackageCheck,
  },
];

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
    value?.trim().toUpperCase();

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

const OrderTimeline = ({
  status,
}: OrderTimelineProps) => {
  const currentStatus =
    getNormalizedStatus(status);

  if (
    currentStatus === "CANCELADO"
  ) {
    return (
      <section className="rounded-[1.75rem] border border-red-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <X size={19} />
          </div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.17em] text-red-500">
              Línea de tiempo
            </p>

            <h3 className="mt-1 text-base font-black text-slate-900">
              Pedido cancelado
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              El flujo operativo de este pedido fue interrumpido.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
              <X size={16} />
            </div>

            <div>
              <p className="text-sm font-black text-red-700">
                Cancelado
              </p>

              <p className="mt-1 text-xs leading-5 text-red-600">
                El pedido ya no continuará hacia preparación, envío o entrega.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentIndex =
    FLOW_STEPS.findIndex(
      (step) =>
        step.status ===
        currentStatus
    );

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#0066FF]">
          Línea de tiempo
        </p>

        <h3 className="mt-1 text-base font-black text-slate-900">
          Progreso del pedido
        </h3>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Seguimiento visual del estado operativo actual.
        </p>
      </div>

      <div className="mt-6 space-y-0">
        {FLOW_STEPS.map(
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
              FLOW_STEPS.length - 1;

            return (
              <div
                key={step.status}
                className="relative flex gap-4"
              >
                {!isLast && (
                  <div
                    className={`absolute left-[19px] top-10 h-[calc(100%-2rem)] w-0.5 ${
                      completed
                        ? "bg-[#97cf00]"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                <div
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                    completed
                      ? "border-[#97cf00] bg-[#97cf00] text-white"
                      : active
                        ? "border-[#0066FF] bg-[#0066FF] text-white shadow-[0_0_0_5px_rgba(0,102,255,0.10)]"
                        : "border-slate-200 bg-white text-slate-400"
                  }`}
                >
                  {completed ? (
                    <Check size={16} />
                  ) : (
                    <StepIcon size={16} />
                  )}
                </div>

                <div
                  className={`min-w-0 flex-1 pb-6 ${
                    isLast
                      ? "pb-0"
                      : ""
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-sm font-black ${
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
                      <span className="rounded-full bg-[#0066FF]/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#0066FF]">
                        Estado actual
                      </span>
                    )}

                    {completed && (
                      <span className="rounded-full bg-[#97cf00]/15 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-[#5f8200]">
                        Completado
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-1 text-xs leading-5 ${
                      pending
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {step.description}
                  </p>
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