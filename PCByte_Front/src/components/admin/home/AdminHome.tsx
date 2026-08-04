import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Package,
  Receipt,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import {
  useAdminDashboard,
} from "../../../hooks/useAdminDashboard";

import {
  useSystemStatus,
} from "../../../hooks/useSystemStatus";

import type {
  AdminDashboardAlert,
} from "../../../types/adminDashboard";

import type {
  SystemServiceStatusData,
} from "../../../types/systemStatus";

import AlertsCard from "./AlertsCard";
import DashboardCard from "./DashboardCard";
import LatestOrdersCard from "./LatestOrdersCard";

import QuickActionsCard, {
  type QuickActionId,
} from "./QuickActionsCard";

import SalesChartCard from "./SalesChartCard";
import TopProductsCard from "./TopProductsCard";

interface AdminHomeProps {
  onQuickAction: (
    action: QuickActionId
  ) => void;

  onOpenAlert: (
    alert: AdminDashboardAlert
  ) => void;

  onViewAllOrders: () => void;

  onViewCatalog: () => void;
}

const AdminHome = ({
  onQuickAction,
  onViewAllOrders,
  onViewCatalog,
  onOpenAlert,
}: AdminHomeProps) => {
  const {
    dashboard,
    loading,
    error,
  } = useAdminDashboard();

  const {
    systemStatus,
    loadingSystemStatus,
    systemStatusError,
    reloadSystemStatus,
  } = useSystemStatus();

  const formatCurrency = (
    value:
      | number
      | null
      | undefined
  ) => {
    return new Intl.NumberFormat(
      "es-CL",
      {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }
    ).format(value ?? 0);
  };

  const currentDate =
    new Intl.DateTimeFormat(
      "es-CL",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    ).format(new Date());

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066FF]" />

          <p className="mt-4 text-sm font-black text-slate-600">
            Cargando dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (
    error ||
    !dashboard
  ) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle
            size={30}
            className="mx-auto text-red-600"
          />

          <p className="mt-4 text-lg font-black text-red-700">
            No fue posible cargar el dashboard
          </p>

          <p className="mt-2 text-sm leading-6 text-red-500">
            Revisa la conexión con el backend e intenta ingresar nuevamente.
          </p>
        </div>
      </div>
    );
  }

  const topProduct =
    dashboard.topProduct;

  const pendingShipments =
    dashboard.pendingShipments;

  const newCustomersToday =
    dashboard.newCustomersToday;

  /*
   * Corresponde exclusivamente a la operación
   * diaria: pedidos, despachos e inventario.
   */
  const hasOperationalWarnings =
    dashboard.pendingOrders > 0 ||
    dashboard.lowStockProducts >
      0 ||
    (
      pendingShipments !== null &&
      pendingShipments > 0
    );

  /*
   * Corresponde exclusivamente al estado técnico
   * de PostgreSQL, Cloudinary, SMTP y pagos.
   */
  const downServices =
  systemStatus?.services.filter(
    (service) =>
      service.status === "DOWN"
  ) ?? [];

const degradedServices =
  systemStatus?.services.filter(
    (service) =>
      service.status ===
      "DEGRADED"
  ) ?? [];

/*
 * Para la presentación visual:
 *
 * - Si un servicio está DOWN, existe una incidencia real.
 * - Si ninguno está DOWN, pero alguno está DEGRADED,
 *   mostramos servicio degradado.
 * - UNAVAILABLE significa que no pudimos consultar
 *   el endpoint de monitoreo.
 */
const systemOverallStatus =
  systemStatusError
    ? "UNAVAILABLE"
    : loadingSystemStatus
      ? "UNKNOWN"
      : downServices.length > 0
        ? "DOWN"
        : degradedServices.length >
            0
          ? "DEGRADED"
          : systemStatus
              ?.overallStatus ??
            "UNKNOWN";

const operationLabel =
  systemOverallStatus === "UP"
    ? "Sistema operativo"
    : systemOverallStatus ===
        "DEGRADED"
      ? "Servicio degradado"
      : systemOverallStatus ===
          "DOWN"
        ? downServices.length > 1
          ? "Estado crítico"
          : "Requiere atención"
        : systemOverallStatus ===
            "UNAVAILABLE"
          ? "Estado no disponible"
          : "Verificando sistema";

const operationBadgeClass =
  systemOverallStatus === "UP"
    ? "border-[#97cf00]/40 bg-[#97cf00]/10 text-[#c7f15a]"
    : systemOverallStatus ===
        "DEGRADED"
      ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
      : systemOverallStatus ===
          "DOWN"
        ? "border-red-500/40 bg-red-500/10 text-red-300"
        : systemOverallStatus ===
            "UNAVAILABLE"
          ? "border-red-400/40 bg-red-400/10 text-red-200"
          : "border-slate-500/40 bg-slate-500/10 text-slate-300";

const operationIconClass =
  systemOverallStatus === "UP"
    ? "text-[#97cf00]"
    : systemOverallStatus ===
        "DEGRADED"
      ? "text-amber-400"
      : systemOverallStatus ===
            "DOWN" ||
          systemOverallStatus ===
            "UNAVAILABLE"
        ? "text-red-400"
        : "text-slate-400";

const getIncidentServiceName = (
  service: SystemServiceStatusData
) => {
  switch (service.key) {
    case "database":
      return "PostgreSQL";

    case "mail":
      return "Correo SMTP";

    case "payments":
      return "Mercado Pago";

    case "cloudinary":
      return "Cloudinary";

    default:
      return service.name;
  }
};

const getSingleIncidentMessage = (
  service: SystemServiceStatusData
) => {
  switch (service.key) {
    case "database":
      return "PostgreSQL sin conexión";

    case "mail":
      return "Correo SMTP desconectado";

    case "payments":
      return "Mercado Pago no disponible";

    case "cloudinary":
      return "Cloudinary no disponible";

    default:
      return `${service.name} no disponible`;
  }
};

const systemSummaryLabel = (() => {
  if (loadingSystemStatus) {
    return "Verificando";
  }

  if (
    systemStatusError ||
    !systemStatus
  ) {
    return "Sin verificación";
  }

  if (downServices.length === 1) {
    return getSingleIncidentMessage(
      downServices[0]
    );
  }

  if (downServices.length === 2) {
    const firstService =
      getIncidentServiceName(
        downServices[0]
      );

    const secondService =
      getIncidentServiceName(
        downServices[1]
      );

    return `${firstService} y ${secondService} no disponibles`;
  }

  if (downServices.length > 2) {
    return `${downServices.length} servicios afectados`;
  }

  if (
    degradedServices.length === 1
  ) {
    return `${getIncidentServiceName(
      degradedServices[0]
    )} degradado`;
  }

  if (
    degradedServices.length > 1
  ) {
    return `${degradedServices.length} servicios degradados`;
  }

  return "Todos operativos";
})();

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#0066FF]/15 bg-gradient-to-br from-[#08101d] via-[#0d1b2e] to-[#10233d] p-4 text-white shadow-[0_18px_50px_rgba(8,16,29,0.15)] sm:p-5">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#0066FF]/20 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-[#97cf00]/10 blur-3xl" />

        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_350px] xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] ${operationBadgeClass}`}
              >
                {systemOverallStatus ===
                "UP" ? (
                  <CheckCircle2
                    size={14}
                    className={
                      operationIconClass
                    }
                  />
                ) : (
                  <AlertTriangle
                    size={14}
                    className={
                      operationIconClass
                    }
                  />
                )}

                {operationLabel}
              </span>

              <span className="inline-flex items-center gap-2 text-[11px] font-bold capitalize text-slate-400">
                <CalendarDays
                  size={14}
                />

                {currentDate}
              </span>
            </div>

            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.24em] text-[#80afff]">
              Centro de operaciones
            </p>

            <h2 className="mt-1.5 text-3xl font-black tracking-tight sm:text-[2.15rem]">
              Buenos días, Esteban.
            </h2>

            <p className="mt-2 max-w-2xl text-[13px] leading-5 text-slate-300">
              Revisa las prioridades de la jornada y el estado general de PCByte.
            </p>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#80afff]">
                  Estado del sistema
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  {systemStatus
                    ? `Última comprobación: ${new Date(
                        systemStatus.checkedAt
                      ).toLocaleTimeString(
                        "es-CL",
                        {
                          hour: "2-digit",
                          minute:
                            "2-digit",
                          second:
                            "2-digit",
                        }
                      )}`
                    : loadingSystemStatus
                      ? "Verificando servicios..."
                      : "Sin una comprobación reciente"}
                </p>
              </div>

              {loadingSystemStatus ? (
                <span className="rounded-full bg-slate-500/15 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-slate-300">
                  Verificando
                </span>
              ) : systemStatusError ? (
                <span className="rounded-full bg-red-500/15 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-red-300">
                  Sin verificación
                </span>
              ) : systemStatus ? (
                <span
                  className={`rounded-full px-2.5 py-1 text-[8px] font-black uppercase tracking-wider ${
                    systemStatus.overallStatus ===
                    "UP"
                      ? "bg-[#97cf00]/15 text-[#b9e34d]"
                      : systemStatus.overallStatus ===
                          "DEGRADED"
                        ? "bg-amber-400/15 text-amber-300"
                        : "bg-red-500/15 text-red-300"
                  }`}
                >
                  {systemSummaryLabel}
                </span>
              ) : null}
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
              {loadingSystemStatus ? (
                <>
                  <SystemStatusSkeleton />
                  <SystemStatusSkeleton />
                  <SystemStatusSkeleton />
                  <SystemStatusSkeleton />
                </>
              ) : systemStatusError ? (
                <div className="sm:col-span-2 xl:col-span-4">
                  <div className="flex flex-col gap-3 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-red-300">
                        Estado del sistema no disponible
                      </p>

                      <p className="mt-1 text-[11px] font-black text-white">
                        No fue posible consultar los servicios.
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        El sistema volverá a intentarlo automáticamente.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        void reloadSystemStatus();
                      }}
                      className="shrink-0 rounded-lg border border-red-300/25 bg-white/5 px-3 py-2 text-[8px] font-black uppercase tracking-wider text-red-200 transition hover:bg-red-500 hover:text-white"
                    >
                      Reintentar ahora
                    </button>
                  </div>
                </div>
              ) : (
                systemStatus?.services.map(
                  (service) => (
                    <StatusItem
                      key={
                        service.key
                      }
                      service={
                        service
                      }
                    />
                  )
                )
              )}
            </div>
          </div>

          <aside className="rounded-[1.4rem] border border-white/10 bg-white/5 p-3.5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#97cf00] text-[#08101d]">
                <Clock3
                  size={17}
                />
              </div>

              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#b9e34d]">
                  Prioridades
                </p>

                <h3 className="mt-0.5 text-sm font-black">
                  Requieren revisión
                </h3>
              </div>
            </div>

            <div className="mt-3 grid gap-1.5">
              <OperationalTask
                label="Pedidos pendientes"
                value={String(
                  dashboard.pendingOrders
                )}
                severity={
                  dashboard.pendingOrders >
                  0
                    ? "danger"
                    : "success"
                }
              />

              <OperationalTask
                label="Despachos por preparar"
                value={
                  pendingShipments !==
                  null
                    ? String(
                        pendingShipments
                      )
                    : "—"
                }
                severity={
                  pendingShipments !==
                    null &&
                  pendingShipments > 0
                    ? "warning"
                    : "success"
                }
              />

              <OperationalTask
                label="Productos con stock crítico"
                value={String(
                  dashboard.lowStockProducts
                )}
                severity={
                  dashboard.lowStockProducts >
                  0
                    ? "warning"
                    : "success"
                }
              />

              <OperationalTask
                label="Clientes nuevos hoy"
                value={
                  newCustomersToday !==
                  null
                    ? String(
                        newCustomersToday
                      )
                    : "—"
                }
                severity="info"
              />
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="mb-3">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Indicadores principales
          </p>

          <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
            Resumen del negocio
          </h3>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-[#0066FF]/10 to-white">
            <DashboardCard
              title="Ventas del día"
              value={formatCurrency(
                dashboard.salesToday
              )}
              description="Ingresos confirmados durante la jornada."
              icon={
                <CircleDollarSign
                  size={22}
                />
              }
            />
          </div>

          <div className="rounded-[1.5rem] bg-gradient-to-br from-[#97cf00]/10 to-white">
            <DashboardCard
              title="Ventas del mes"
              value={formatCurrency(
                dashboard.salesCurrentMonth
              )}
              description="Total acumulado durante el mes actual."
              icon={
                <Package
                  size={22}
                />
              }
            />
          </div>

          <DashboardCard
            title="Pedidos pendientes"
            value={String(
              dashboard.pendingOrders
            )}
            description="Órdenes que aún requieren gestión."
            icon={
              <ShoppingCart
                size={22}
              />
            }
            badge={
              dashboard.pendingOrders >
              0
                ? "Atención"
                : undefined
            }
          />

          <DashboardCard
            title="Stock crítico"
            value={String(
              dashboard.lowStockProducts
            )}
            description="Productos con cinco unidades o menos."
            icon={
              <AlertTriangle
                size={22}
              />
            }
            trend={
              dashboard.lowStockProducts >
              0
                ? {
                    value: "Revisar",
                    positive: false,
                  }
                : undefined
            }
          />

          <DashboardCard
            title="Despachos pendientes"
            value={
              pendingShipments !== null
                ? String(
                    pendingShipments
                  )
                : "—"
            }
            description={
              pendingShipments !== null
                ? "Pedidos pagados o actualmente en preparación."
                : "Métrica pendiente de integración."
            }
            icon={
              <Truck size={22} />
            }
          />

          <DashboardCard
            title="Ticket promedio"
            value={formatCurrency(
              dashboard.averageTicket
            )}
            description="Valor promedio de los pedidos confirmados."
            icon={
              <Receipt size={22} />
            }
          />
        </div>
      </section>

      <section>
        <QuickActionsCard
          onAction={
            onQuickAction
          }
        />
      </section>

      <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(330px,0.6fr)]">
        <article className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                Estado general
              </p>

              <h3 className="mt-0.5 text-lg font-black tracking-tight text-slate-900">
                Estado operativo
              </h3>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[8px] font-black uppercase tracking-wider ${
                hasOperationalWarnings
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#97cf00]/15 text-[#5f8200]"
              }`}
            >
              {hasOperationalWarnings ? (
                <AlertTriangle
                  size={13}
                />
              ) : (
                <CheckCircle2
                  size={13}
                />
              )}

              {hasOperationalWarnings
                ? "Requiere atención"
                : "Operación estable"}
            </span>
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <HealthItem
              title="Pedidos"
              description={
                dashboard.pendingOrders >
                0
                  ? `${dashboard.pendingOrders} ${
                      dashboard.pendingOrders ===
                      1
                        ? "pedido requiere"
                        : "pedidos requieren"
                    } seguimiento.`
                  : "No hay pedidos pendientes."
              }
              status={
                dashboard.pendingOrders >
                0
                  ? "warning"
                  : "success"
              }
            />

            <HealthItem
              title="Despachos"
              description={
                pendingShipments === null
                  ? "La métrica aún no está disponible."
                  : pendingShipments >
                      0
                    ? `${pendingShipments} ${
                        pendingShipments ===
                        1
                          ? "despacho debe"
                          : "despachos deben"
                      } prepararse.`
                    : "No hay despachos pendientes."
              }
              status={
                pendingShipments === null
                  ? "warning"
                  : pendingShipments >
                      0
                    ? "warning"
                    : "success"
              }
            />

            <HealthItem
              title="Pagos"
              description="No existen pagos con incidencias críticas."
              status="success"
            />

            <HealthItem
              title="Inventario"
              description={
                dashboard.lowStockProducts >
                0
                  ? `${dashboard.lowStockProducts} ${
                      dashboard.lowStockProducts ===
                      1
                        ? "producto tiene"
                        : "productos tienen"
                    } stock crítico.`
                  : "No hay productos con stock crítico."
              }
              status={
                dashboard.lowStockProducts >
                0
                  ? "danger"
                  : "success"
              }
            />
          </div>
        </article>

        <article className="h-fit rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Producto estrella
          </p>

          {topProduct ? (
            <>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  {topProduct.imageUrl ? (
                    <img
                      src={
                        topProduct.imageUrl
                      }
                      alt={
                        topProduct.name
                      }
                      className="h-full w-full object-contain p-1.5"
                    />
                  ) : (
                    <Star
                      size={23}
                      className="text-[#0066FF]"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-black leading-5 text-slate-900">
                    {topProduct.name}
                  </h3>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-slate-400">
                    Más vendido del mes
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
                <ProductMetric
                  label="Unidades"
                  value={String(
                    topProduct.unitsSold
                  )}
                />

                <ProductMetric
                  label="Facturación"
                  value={formatCurrency(
                    topProduct.revenue
                  )}
                />

                <ProductMetric
                  label="Stock actual"
                  value={String(
                    topProduct.currentStock
                  )}
                  danger={
                    topProduct.currentStock <=
                    5
                  }
                />
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400">
                <Star size={19} />
              </div>

              <p className="mt-3 text-sm font-black text-slate-700">
                Aún no hay producto estrella
              </p>

              <p className="mt-1.5 text-[11px] leading-4 text-slate-500">
                Aparecerá automáticamente cuando existan ventas pagadas.
              </p>
            </div>
          )}
        </article>
      </section>

      <section>
        <SalesChartCard
          sales={
            dashboard.weeklySales
          }
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <LatestOrdersCard
          orders={
            dashboard.latestOrders
          }
          onViewAll={
            onViewAllOrders
          }
        />

        <TopProductsCard
          products={
            dashboard.topProducts
          }
          onViewCatalog={
            onViewCatalog
          }
        />
      </section>

      <section>
        <AlertsCard
          alerts={
            dashboard.alerts
          }
          onOpenAlert={
            onOpenAlert
          }
        />
      </section>
    </div>
  );
};

interface StatusItemProps {
  service: SystemServiceStatusData;
}

const StatusItem = ({
  service,
}: StatusItemProps) => {
  const isUp =
    service.status === "UP";

  const isDegraded =
    service.status ===
    "DEGRADED";

  const indicatorClass =
    isUp
      ? "bg-[#97cf00]"
      : isDegraded
        ? "bg-amber-400"
        : "bg-red-500";

  const animationClass =
    isUp
      ? "pcbyte-status-up"
      : isDegraded
        ? "pcbyte-status-degraded"
        : "pcbyte-status-down";

  const statusLabel =
    service.key === "database"
      ? isUp
        ? "Conectada"
        : "Sin conexión"
      : service.key === "mail"
        ? isUp
          ? "Conectado"
          : "Sin conexión"
        : isUp
          ? "Disponible"
          : isDegraded
            ? "Degradado"
            : "No disponible";

  const responseTimeClass =
    service.responseTimeMs <= 200
      ? "text-[#97cf00]"
      : service.responseTimeMs <=
          1000
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div
      title={`${service.name}

Estado: ${statusLabel}

${service.message}

Tiempo de respuesta: ${service.responseTimeMs} ms`}
      className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-[8px] font-black uppercase tracking-[0.16em] text-slate-500">
          {service.name}
        </p>

        <span
          className={`shrink-0 text-[8px] font-black ${responseTimeClass}`}
        >
          {service.responseTimeMs} ms
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">
          <span
            className={`h-2.5 w-2.5 rounded-full ${indicatorClass} ${animationClass}`}
          />
        </span>

        <p className="truncate text-[11px] font-black text-white">
          {statusLabel}
        </p>
      </div>
    </div>
  );
};

const SystemStatusSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-white/10 bg-white/5 px-3.5 py-2">
      <div className="h-2 w-20 rounded bg-white/10" />

      <div className="mt-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-white/10" />

        <div className="h-3 w-16 rounded bg-white/10" />
      </div>
    </div>
  );
};

interface OperationalTaskProps {
  label: string;
  value: string;

  severity:
    | "success"
    | "info"
    | "warning"
    | "danger";
}

const OperationalTask = ({
  label,
  value,
  severity,
}: OperationalTaskProps) => {
  const indicatorClasses = {
    success:
      "bg-[#97cf00] text-[#08101d]",

    info:
      "bg-[#0066FF] text-white",

    warning:
      "bg-amber-400 text-slate-900",

    danger:
      "bg-red-500 text-white",
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${
            indicatorClasses[
              severity
            ].split(" ")[0]
          }`}
        />

        <p className="truncate text-[11px] font-bold text-slate-300">
          {label}
        </p>
      </div>

      <span
        className={`flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[10px] font-black ${
          indicatorClasses[
            severity
          ]
        }`}
      >
        {value}
      </span>
    </div>
  );
};

interface HealthItemProps {
  title: string;
  description: string;

  status:
    | "success"
    | "warning"
    | "danger";
}

const HealthItem = ({
  title,
  description,
  status,
}: HealthItemProps) => {
  const statusClasses = {
    success:
      "border-[#97cf00]/25 bg-[#97cf00]/5 text-[#6f9900]",

    warning:
      "border-amber-200 bg-amber-50 text-amber-600",

    danger:
      "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <div className="flex min-h-[58px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border ${statusClasses[status]}`}
      >
        {status ===
        "success" ? (
          <CheckCircle2
            size={14}
          />
        ) : (
          <AlertTriangle
            size={14}
          />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-[12px] font-black text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

interface ProductMetricProps {
  label: string;
  value: string;
  danger?: boolean;
}

const ProductMetric = ({
  label,
  value,
  danger = false,
}: ProductMetricProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
      <p className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-[13px] font-black ${
          danger
            ? "text-red-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default AdminHome;