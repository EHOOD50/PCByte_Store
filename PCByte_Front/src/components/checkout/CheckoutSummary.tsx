import {
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import type {
  CartItem,
} from "../../types/types";

interface CheckoutSummaryProps {
  cart: CartItem[];
  total: number;
}

const formatCurrency = (
  value: number
): string => {
  return new Intl.NumberFormat(
    "es-CL",
    {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }
  ).format(value);
};

export const CheckoutSummary = ({
  cart,
  total,
}: CheckoutSummaryProps) => {
  const totalUnits = cart.reduce(
    (accumulator, item) =>
      accumulator +
      item.quantity,
    0
  );

  return (
    <aside className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-4">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
            Tu compra
          </p>

          <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
            Resumen del pedido
          </h2>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#6f9900]">
          <PackageCheck size={19} />
        </div>
      </div>

      <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
        {cart.map((item) => {
          const itemSubtotal =
            item.product.price *
            item.quantity;

          return (
            <article
              key={item.product.id}
              className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                {item.product.imageUrl ? (
                  <img
                    src={
                      item.product.imageUrl
                    }
                    alt={
                      item.product.name
                    }
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <PackageCheck
                    size={20}
                    className="text-slate-300"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs font-black leading-5 text-slate-700">
                  {item.product.name}
                </p>

                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#0066FF]">
                    {item.quantity}{" "}
                    {item.quantity === 1
                      ? "unidad"
                      : "unidades"}
                  </span>

                  <span className="shrink-0 text-xs font-black text-slate-900">
                    {formatCurrency(
                      itemSubtotal
                    )}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Productos
          </span>

          <span className="text-xs font-bold text-slate-600">
            {totalUnits}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Despacho
          </span>

          <span className="text-xs font-bold text-slate-500">
            Se calculará después
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-5">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
              Total productos
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Impuestos incluidos
            </p>
          </div>

          <span className="text-3xl font-black tracking-tight text-[#0066FF]">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex items-start gap-3 rounded-2xl border border-[#97cf00]/25 bg-[#97cf00]/5 p-4">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[#6f9900]"
          />

          <p className="text-[11px] leading-5 text-slate-600">
            Tu compra será procesada
            de forma segura por
            PCByte.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
          <LockKeyhole size={13} />
          Pago protegido
        </div>
      </div>
    </aside>
  );
};

export default CheckoutSummary;