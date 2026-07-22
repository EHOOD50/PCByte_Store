import {
  ArrowLeft,
  CreditCard,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export type PaymentMethod =
  | "mercado_pago";

interface PaymentStepProps {
  selectedMethod: PaymentMethod | null;
  isLoading: boolean;
  onSelectMethod: (
    method: PaymentMethod
  ) => void;
  onBack: () => void;
  onPay: () => void;
}

export const PaymentStep = ({
  selectedMethod,
  isLoading,
  onSelectMethod,
  onBack,
  onPay,
}: PaymentStepProps) => {
  const isValid =
    selectedMethod !== null;

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
          <CreditCard size={21} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
            Paso 4
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Medio de pago
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Selecciona cómo deseas pagar tu compra.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() =>
            onSelectMethod(
              "mercado_pago"
            )
          }
          className={`w-full rounded-[1.5rem] border-2 p-5 text-left transition ${
            selectedMethod ===
            "mercado_pago"
              ? "border-[#0066FF] bg-[#f7faff] shadow-[0_12px_35px_rgba(0,102,255,0.10)]"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                selectedMethod ===
                "mercado_pago"
                  ? "bg-[#0066FF]/10 text-[#0066FF]"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <CreditCard size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-slate-900">
                    Mercado Pago
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Serás redirigido al entorno seguro de Mercado Pago para completar el pago.
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-[#97cf00]/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#5f8200]">
                  Pago seguro
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
                  <LockKeyhole
                    size={16}
                    className="mt-0.5 shrink-0 text-[#0066FF]"
                  />

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Protección
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-600">
                      Transacción protegida
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-[#0066FF]"
                  />

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Procesamiento
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-600">
                      Gestionado por Mercado Pago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                selectedMethod ===
                "mercado_pago"
                  ? "border-[#0066FF]"
                  : "border-slate-300"
              }`}
            >
              {selectedMethod ===
                "mercado_pago" && (
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
          PCByte no almacena los datos de tu tarjeta. El pago se realiza directamente en la plataforma segura del proveedor.
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={17} />
          Volver a despacho
        </button>

        <button
          type="button"
          onClick={onPay}
          disabled={
            !isValid ||
            isLoading
          }
          className="group flex min-h-[50px] items-center justify-center gap-3 rounded-xl bg-[#97cf00] px-8 text-xs font-black uppercase text-slate-900 transition hover:bg-[#86b900] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          {isLoading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Preparando pago...
            </>
          ) : (
            <>
              <CreditCard size={18} />
              Ir a pagar
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default PaymentStep;