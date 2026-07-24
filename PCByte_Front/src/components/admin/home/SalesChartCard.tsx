import {
  ArrowUpRight,
  BarChart3,
} from "lucide-react";

import type {
  AdminDashboardDailySales,
} from "../../../types/adminDashboard";

interface SalesChartCardProps {
  sales:
    | AdminDashboardDailySales[]
    | null;
}

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

const SalesChartCard = ({
  sales,
}: SalesChartCardProps) => {
  const salesData =
    sales ?? [];

  const maxValue = Math.max(
    0,
    ...salesData.map(
      (item) => item.total
    )
  );

  const weeklyTotal =
    salesData.reduce(
      (total, item) =>
        total + item.total,
      0
    );

  const bestDay =
    salesData.reduce<
      AdminDashboardDailySales | null
    >(
      (
        currentBest,
        item
      ) => {
        if (
          currentBest === null ||
          item.total >
            currentBest.total
        ) {
          return item;
        }

        return currentBest;
      },
      null
    );

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
            <BarChart3 size={23} />
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
              Rendimiento comercial
            </p>

            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
              Ventas de los últimos 7 días
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Evolución diaria de las ventas confirmadas.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#97cf00]/25 bg-[#97cf00]/5 px-4 py-3">
          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#6f9900]">
            Total semanal
          </p>

          <div className="mt-1 flex items-center gap-2">
            <p className="text-lg font-black text-slate-900">
              {formatCurrency(
                weeklyTotal
              )}
            </p>

            {weeklyTotal > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#97cf00]/15 px-2 py-1 text-[9px] font-black text-[#5f8200]">
                <ArrowUpRight size={12} />
                Activo
              </span>
            )}
          </div>
        </div>
      </div>

      {salesData.length === 0 ? (
        <div className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-sm font-black text-slate-700">
            No hay datos de ventas disponibles
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            El gráfico aparecerá cuando el backend entregue el resumen semanal.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-7">
            <div className="grid h-[250px] grid-cols-7 items-end gap-3 border-b border-slate-200 pb-3 sm:gap-5">
              {salesData.map(
                (item) => {
                  const height =
                    maxValue === 0
                      ? 0
                      : Math.max(
                          8,
                          Math.round(
                            (
                              item.total /
                              maxValue
                            ) * 100
                          )
                        );

                  return (
                    <div
                      key={
                        item.date
                      }
                      className="group flex h-full flex-col items-center justify-end"
                    >
                      <div className="relative flex h-full w-full items-end justify-center">
                        <div
                          className={`relative w-full max-w-12 rounded-t-xl transition group-hover:brightness-110 ${
                            item.total > 0
                              ? "bg-gradient-to-t from-[#0066FF] to-[#55a0ff]"
                              : "bg-slate-200"
                          }`}
                          style={{
                            height:
                              item.total > 0
                                ? `${height}%`
                                : "8px",
                          }}
                        >
                          <div className="pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[9px] font-black text-white shadow-lg group-hover:block">
                            {formatCurrency(
                              item.total
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="mt-3 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {item.day}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                Mejor jornada
              </p>

              <p className="mt-1 text-sm font-black text-slate-900">
                {bestDay
                  ? `${bestDay.day} · ${formatCurrency(
                      bestDay.total
                    )}`
                  : "Sin ventas"}
              </p>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              Datos calculados a partir de pedidos pagados durante los últimos siete días.
            </p>
          </div>
        </>
      )}
    </article>
  );
};

export default SalesChartCard;