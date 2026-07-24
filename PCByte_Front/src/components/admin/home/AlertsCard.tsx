import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Info,
  Package,
  ShoppingCart,
} from "lucide-react";

import type {
  AdminDashboardAlert,
  AdminDashboardAlertLevel,
} from "../../../types/adminDashboard";

interface AlertsCardProps {
  alerts:
    | AdminDashboardAlert[]
    | null;
}

interface AlertStyle {
  container: string;
  iconContainer: string;
  badge: string;
  badgeLabel: string;
}

const alertStyles: Record<
  AdminDashboardAlertLevel,
  AlertStyle
> = {
  CRITICAL: {
    container:
      "border-red-200 bg-red-50",
    iconContainer:
      "bg-red-100 text-red-600",
    badge:
      "bg-red-100 text-red-700",
    badgeLabel: "Crítico",
  },

  WARNING: {
    container:
      "border-orange-200 bg-orange-50",
    iconContainer:
      "bg-orange-100 text-orange-600",
    badge:
      "bg-orange-100 text-orange-700",
    badgeLabel: "Atención",
  },

  INFO: {
    container:
      "border-blue-200 bg-blue-50",
    iconContainer:
      "bg-blue-100 text-blue-600",
    badge:
      "bg-blue-100 text-blue-700",
    badgeLabel: "Información",
  },

  SUCCESS: {
    container:
      "border-green-200 bg-green-50",
    iconContainer:
      "bg-green-100 text-green-600",
    badge:
      "bg-green-100 text-green-700",
    badgeLabel: "Correcto",
  },
};

const getAlertIcon = (
  alert: AdminDashboardAlert
) => {
  if (
    alert.level === "SUCCESS"
  ) {
    return (
      <CheckCircle2 size={18} />
    );
  }

  if (
    alert.level === "INFO"
  ) {
    return <Info size={18} />;
  }

  if (
    alert.type === "PRODUCT"
  ) {
    return <Package size={18} />;
  }

  if (
    alert.type === "ORDER"
  ) {
    return (
      <ShoppingCart size={18} />
    );
  }

  if (
    alert.level === "CRITICAL"
  ) {
    return (
      <AlertCircle size={18} />
    );
  }

  return (
    <AlertTriangle size={18} />
  );
};

const formatAlertDate = (
  value: string
) => {
  const parsedDate =
    new Date(value);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat(
    "es-CL",
    {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(parsedDate);
};

const AlertsCard = ({
  alerts,
}: AlertsCardProps) => {
  const visibleAlerts =
    alerts?.slice(0, 10) ?? [];

  const criticalCount =
    visibleAlerts.filter(
      (alert) =>
        alert.level ===
        "CRITICAL"
    ).length;

  const warningCount =
    visibleAlerts.filter(
      (alert) =>
        alert.level ===
        "WARNING"
    ).length;

  const hasAttentionAlerts =
    criticalCount > 0 ||
    warningCount > 0;

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Centro de alertas
          </p>

          <h3 className="mt-1 text-xl font-black text-slate-900">
            {hasAttentionAlerts
              ? "Requieren atención"
              : "Estado operativo"}
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Alertas generadas según el estado real de pedidos e inventario.
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            criticalCount > 0
              ? "bg-red-100 text-red-600"
              : warningCount > 0
                ? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"
          }`}
        >
          {criticalCount > 0 ? (
            <AlertCircle size={22} />
          ) : warningCount > 0 ? (
            <AlertTriangle size={22} />
          ) : (
            <CheckCircle2 size={22} />
          )}
        </div>
      </div>

      {visibleAlerts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400">
            <Clock3 size={21} />
          </div>

          <p className="mt-4 text-sm font-black text-slate-700">
            No hay alertas disponibles
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Las incidencias aparecerán aquí automáticamente.
          </p>
        </div>
      ) : (
        <div className="mt-6 max-h-[560px] space-y-4 overflow-y-auto pr-1">
          {visibleAlerts.map(
            (alert) => {
              const style =
                alertStyles[
                  alert.level
                ];

              return (
                <div
                  key={`${alert.code}-${alert.referenceId ?? "system"}-${alert.createdAt}`}
                  className={`rounded-2xl border p-4 transition hover:shadow-md ${style.container}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.iconContainer}`}
                    >
                      {getAlertIcon(
                        alert
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${style.badge}`}
                        >
                          {
                            style.badgeLabel
                          }
                        </span>

                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          {alert.type ===
                          "ORDER"
                            ? "Pedido"
                            : alert.type ===
                                "PRODUCT"
                              ? "Producto"
                              : "Sistema"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-black text-slate-900">
                        {alert.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-600">
                        {
                          alert.description
                        }
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <p className="text-[10px] font-bold text-slate-400">
                          {formatAlertDate(
                            alert.createdAt
                          )}
                        </p>

                        {alert.action !==
                          "NONE" &&
                          alert.referenceId !==
                            null && (
                            <button
                              type="button"
                              disabled
                              title="La navegación se habilitará al mejorar el módulo correspondiente"
                              className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-slate-300 bg-white/70 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400"
                            >
                              Abrir
                              <ArrowRight
                                size={12}
                              />
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-red-500">
            Críticas
          </p>

          <p className="mt-2 text-xl font-black text-red-700">
            {criticalCount}
          </p>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <p className="text-[9px] font-black uppercase tracking-wider text-orange-500">
            Atención
          </p>

          <p className="mt-2 text-xl font-black text-orange-700">
            {warningCount}
          </p>
        </div>
      </div>
    </article>
  );
};

export default AlertsCard;