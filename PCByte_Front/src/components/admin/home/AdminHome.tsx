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
  Users,
} from "lucide-react";

import DashboardCard from "./DashboardCard";
import SalesChartCard from "./SalesChartCard";
import LatestOrdersCard from "./LatestOrdersCard";
import TopProductsCard from "./TopProductsCard";
import AlertsCard from "./AlertsCard";
import QuickActionsCard from "./QuickActionsCard";

import { useAdminDashboard } from "../../../hooks/useAdminDashboard";

const AdminHome = () => {
  const {
    dashboard,
    loading,
    error,
  } = useAdminDashboard();

  const formatCurrency = (
    value: number | null | undefined
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

  if (error || !dashboard) {
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

  const hasOperationalWarnings =
    dashboard.pendingOrders > 0 ||
    dashboard.lowStockProducts > 0 ||
    (
      pendingShipments !== null &&
      pendingShipments > 0
    );

  const operationLabel =
    hasOperationalWarnings
      ? "Requiere atención"
      : "Operación normal";

  const operationBadgeClasses =
    hasOperationalWarnings
      ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
      : "border-[#97cf00]/20 bg-[#97cf00]/10 text-[#b9e34d]";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#0066FF]/15 bg-gradient-to-br from-[#08101d] via-[#0d1b2e] to-[#10233d] p-5 text-white shadow-[0_20px_60px_rgba(8,16,29,0.16)] sm:p-6">
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#0066FF]/20 blur-3xl" />

        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#97cf00]/10 blur-3xl" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] ${operationBadgeClasses}`}
              >
                {hasOperationalWarnings ? (
                  <AlertTriangle size={14} />
                ) : (
                  <CheckCircle2 size={14} />
                )}

                {operationLabel}
              </span>

              <span className="inline-flex items-center gap-2 text-xs font-bold capitalize text-slate-400">
                <CalendarDays size={15} />
                {currentDate}
              </span>
            </div>

            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em] text-[#80afff]">
              Centro de operaciones PCByte
            </p>

            <h2 className="mt-1.5 text-3xl font-black tracking-tight sm:text-4xl">
              Buenos días, Esteban 👋
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Revisa el estado de la tienda y las tareas que necesitan atención durante la jornada.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <StatusItem
                label="Pagos"
                value="Operativos"
              />

              <StatusItem
                label="Base de datos"
                value="Conectada"
              />

              <StatusItem
                label="Tienda"
                value="Disponible"
              />
            </div>
          </div>

          <aside className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#97cf00] text-[#08101d]">
                <Clock3 size={19} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#b9e34d]">
                  Agenda operativa
                </p>

                <h3 className="mt-0.5 text-base font-black">
                  Hoy debes revisar
                </h3>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
              <OperationalTask
                label="Pedidos pendientes"
                value={String(
                  dashboard.pendingOrders
                )}
              />

              <OperationalTask
                label="Despachos por preparar"
                value={
                  pendingShipments !== null
                    ? String(
                        pendingShipments
                      )
                    : "—"
                }
              />

              <OperationalTask
                label="Stock crítico"
                value={String(
                  dashboard.lowStockProducts
                )}
              />

              <OperationalTask
                label="Clientes nuevos"
                value={
                  newCustomersToday !== null
                    ? String(
                        newCustomersToday
                      )
                    : "—"
                }
              />
            </div>
          </aside>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Indicadores principales
          </p>

          <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Resumen del negocio
          </h3>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#0066FF]/10 to-white">
            <DashboardCard
              title="Ventas del día"
              value={formatCurrency(
                dashboard.salesToday
              )}
              description="Ingresos confirmados durante la jornada."
              icon={
                <CircleDollarSign size={24} />
              }
            />
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-[#97cf00]/10 to-white">
            <DashboardCard
              title="Ventas del mes"
              value={formatCurrency(
                dashboard.salesCurrentMonth
              )}
              description="Total acumulado durante el mes actual."
              icon={<Package size={24} />}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DashboardCard
            title="Pedidos pendientes"
            value={String(
              dashboard.pendingOrders
            )}
            description="Órdenes que aún requieren gestión."
            icon={
              <ShoppingCart size={24} />
            }
            badge={
              dashboard.pendingOrders > 0
                ? "Atención"
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
            icon={<Truck size={24} />}
          />

          <DashboardCard
            title="Stock crítico"
            value={String(
              dashboard.lowStockProducts
            )}
            description="Productos con cinco unidades o menos."
            icon={
              <AlertTriangle size={24} />
            }
            trend={
              dashboard.lowStockProducts > 0
                ? {
                    value: "Revisar",
                    positive: false,
                  }
                : undefined
            }
          />

          <DashboardCard
            title="Ticket promedio"
            value={formatCurrency(
              dashboard.averageTicket
            )}
            description="Valor promedio de los pedidos confirmados."
            icon={<Receipt size={24} />}
          />

          <DashboardCard
            title="Clientes nuevos"
            value={
              newCustomersToday !== null
                ? String(
                    newCustomersToday
                  )
                : "—"
            }
            description={
              newCustomersToday !== null
                ? "Nuevas cuentas registradas hoy."
                : "Métrica pendiente de integración."
            }
            icon={<Users size={24} />}
          />

          <DashboardCard
            title="Producto estrella"
            value={
              topProduct?.name ??
              "Sin ventas"
            }
            description={
              topProduct
                ? `${topProduct.unitsSold} ${
                    topProduct.unitsSold === 1
                      ? "unidad vendida"
                      : "unidades vendidas"
                  }`
                : "Aún no existen productos vendidos."
            }
            icon={<Star size={24} />}
            badge={
              topProduct
                ? "Más vendido"
                : undefined
            }
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                Estado general
              </p>

              <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                Salud del negocio
              </h3>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-wider ${
                hasOperationalWarnings
                  ? "bg-amber-100 text-amber-700"
                  : "bg-[#97cf00]/15 text-[#5f8200]"
              }`}
            >
              {hasOperationalWarnings ? (
                <AlertTriangle size={14} />
              ) : (
                <CheckCircle2 size={14} />
              )}

              {hasOperationalWarnings
                ? "Requiere atención"
                : "Operación estable"}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <HealthItem
              title="Pedidos"
              description={
                dashboard.pendingOrders > 0
                  ? `${dashboard.pendingOrders} ${
                      dashboard.pendingOrders ===
                      1
                        ? "pedido requiere"
                        : "pedidos requieren"
                    } seguimiento.`
                  : "No hay pedidos pendientes."
              }
              status={
                dashboard.pendingOrders > 0
                  ? "warning"
                  : "success"
              }
            />

            <HealthItem
              title="Despachos"
              description={
                pendingShipments === null
                  ? "La métrica de despachos aún no está disponible."
                  : pendingShipments > 0
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
                  : pendingShipments > 0
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
                dashboard.lowStockProducts > 0
                  ? `${dashboard.lowStockProducts} ${
                      dashboard.lowStockProducts ===
                      1
                        ? "producto tiene"
                        : "productos tienen"
                    } stock crítico.`
                  : "No hay productos con stock crítico."
              }
              status={
                dashboard.lowStockProducts > 0
                  ? "danger"
                  : "success"
              }
            />
          </div>
        </article>

        <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Producto estrella
          </p>

          {topProduct ? (
            <>
              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {topProduct.imageUrl ? (
                    <img
                      src={
                        topProduct.imageUrl
                      }
                      alt={
                        topProduct.name
                      }
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <Star
                      size={28}
                      className="text-[#0066FF]"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-black leading-6 text-slate-900">
                    {topProduct.name}
                  </h3>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Más vendido del mes
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
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
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400">
                <Star size={24} />
              </div>

              <p className="mt-4 text-sm font-black text-slate-700">
                Aún no hay producto estrella
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
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

      <section className="grid gap-6 xl:grid-cols-2">
        <LatestOrdersCard
          orders={
            dashboard.latestOrders
          }
        />

        <TopProductsCard
          products={
            dashboard.topProducts
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <AlertsCard
          alerts={
            dashboard.alerts
          }
        />

        <QuickActionsCard />
      </section>
    </div>
  );
};

interface StatusItemProps {
  label: string;
  value: string;
}

const StatusItem = ({
  label,
  value,
}: StatusItemProps) => {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#97cf00]" />

        <p className="text-xs font-black text-white">
          {value}
        </p>
      </div>
    </div>
  );
};

interface OperationalTaskProps {
  label: string;
  value: string;
}

const OperationalTask = ({
  label,
  value,
}: OperationalTaskProps) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/10 px-3.5 py-2.5">
      <p className="text-xs font-bold text-slate-300">
        {label}
      </p>

      <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-[#0066FF] px-2 text-[11px] font-black text-white">
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
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${statusClasses[status]}`}
      >
        {status === "success" ? (
          <CheckCircle2 size={17} />
        ) : (
          <AlertTriangle size={17} />
        )}
      </div>

      <div>
        <p className="text-sm font-black text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 text-sm font-black ${
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