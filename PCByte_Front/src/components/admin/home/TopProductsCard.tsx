import {
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import type {
  AdminDashboardTopProduct,
} from "../../../types/adminDashboard";

interface TopProductsCardProps {
  products:
    | AdminDashboardTopProduct[]
    | null;
}

const medals = [
  "🥇",
  "🥈",
  "🥉",
  "4",
  "5",
];

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

const TopProductsCard = ({
  products,
}: TopProductsCardProps) => {
  const visibleProducts =
    products?.slice(0, 5) ?? [];

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Ranking comercial
          </p>

          <h3 className="mt-1 text-xl font-black text-slate-900">
            Top productos
          </h3>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#97cf00]/10 text-[#6f9900]">
          <TrendingUp size={22} />
        </div>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm font-black text-slate-700">
            Aún no hay ventas registradas
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            El ranking aparecerá cuando existan productos vendidos en pedidos pagados.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {visibleProducts.map(
            (
              product,
              index
            ) => (
              <div
                key={
                  product.productId
                }
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-[#0066FF]/25 hover:bg-slate-50"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-black">
                  {medals[index]}
                </div>

                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {product.imageUrl ? (
                    <img
                      src={
                        product.imageUrl
                      }
                      alt={
                        product.name
                      }
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] font-black uppercase text-slate-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-slate-900">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {product.unitsSold}{" "}
                    {product.unitsSold ===
                    1
                      ? "unidad vendida"
                      : "unidades vendidas"}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-slate-900">
                    {formatCurrency(
                      product.revenue
                    )}
                  </p>

                  <p
                    className={`mt-1 text-xs font-bold ${
                      product.currentStock <=
                      5
                        ? "text-red-500"
                        : "text-slate-500"
                    }`}
                  >
                    Stock{" "}
                    {
                      product.currentStock
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}

      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#0066FF]/20 bg-[#0066FF]/5 py-3 text-xs font-black uppercase tracking-wider text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white"
      >
        Ver catálogo completo
        <ArrowRight size={15} />
      </button>
    </article>
  );
};

export default TopProductsCard;