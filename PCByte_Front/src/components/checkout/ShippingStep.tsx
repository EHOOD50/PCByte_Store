import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";

export type ShippingMethod =
  | "home_delivery";

interface ShippingStepProps {
  selectedMethod: ShippingMethod | null;
  onSelectMethod: (
    method: ShippingMethod
  ) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const ShippingStep = ({
  selectedMethod,
  onSelectMethod,
  onBack,
  onContinue,
}: ShippingStepProps) => {
  const isValid =
    selectedMethod !== null;

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#6f9900]">
          <Truck size={21} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
            Paso 3
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Método de despacho
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Selecciona cómo deseas
            recibir tu compra.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() =>
            onSelectMethod(
              "home_delivery"
            )
          }
          className={`w-full rounded-[1.5rem] border-2 p-5 text-left transition ${
            selectedMethod ===
            "home_delivery"
              ? "border-[#0066FF] bg-[#f7faff] shadow-[0_12px_35px_rgba(0,102,255,0.10)]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                selectedMethod ===
                "home_delivery"
                  ? "bg-[#0066FF]/10 text-[#0066FF]"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <Truck size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-slate-900">
                    Despacho a domicilio
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Enviaremos tu pedido
                    a la dirección
                    seleccionada.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#97cf00]/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#5f8200]">
                  Disponible
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-[#0066FF]"
                  />

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Cobertura
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-600">
                      Según región y comuna
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
                  <Clock3
                    size={16}
                    className="mt-0.5 shrink-0 text-[#0066FF]"
                  />

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Plazo estimado
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-600">
                      Se informará antes del pago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                selectedMethod ===
                "home_delivery"
                  ? "border-[#0066FF]"
                  : "border-slate-300"
              }`}
            >
              {selectedMethod ===
                "home_delivery" && (
                <div className="h-2.5 w-2.5 rounded-full bg-[#0066FF]" />
              )}
            </div>
          </div>
        </button>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#97cf00]/25 bg-[#97cf00]/5 p-4">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0 text-[#6f9900]"
        />

        <p className="text-[11px] leading-5 text-slate-600">
          El costo y el plazo final
          del despacho se calcularán
          según la dirección
          seleccionada antes de
          confirmar el pago.
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Volver a dirección
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!isValid}
          className="group flex min-h-[50px] items-center justify-center gap-3 rounded-xl bg-slate-900 px-7 text-xs font-black uppercase text-white transition hover:bg-[#0066FF] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Continuar al pago

          <ArrowRight
            size={18}
            className="text-[#97cf00] transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
};

export default ShippingStep;