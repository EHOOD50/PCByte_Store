import {
  Plus,
  RefreshCw,
  Truck,
} from "lucide-react";

interface ShippingToolbarProps {
  loading: boolean;
  onNewRate: () => void;
  onRefresh: () => void;
}

const ShippingToolbar = ({
  loading,
  onNewRate,
  onRefresh,
}: ShippingToolbarProps) => {
  return (
    <section className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
          <Truck size={23} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#0066FF]">
            Logística
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Tarifas de despacho
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Administra precios, cobertura, plazos y condiciones de envío.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Actualizar
        </button>

        <button
          type="button"
          onClick={onNewRate}
          disabled={loading}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#97cf00] px-6 text-xs font-black uppercase text-slate-900 transition hover:bg-[#86b900] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          <Plus size={18} />
          Nueva tarifa
        </button>
      </div>
    </section>
  );
};

export default ShippingToolbar;