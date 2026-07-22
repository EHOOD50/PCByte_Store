import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Plus,
} from "lucide-react";

import type { Address } from "../../types/types";

interface SavedAddressesStepProps {
  addresses: Address[];
  loading: boolean;
  error: string | null;
  selectedAddressId: number | null;
  onSelectAddress: (addressId: number) => void;
  onUseNewAddress: () => void;
  onBack: () => void;
  onContinue: () => void;
}

export const SavedAddressesStep = ({
  addresses,
  loading,
  error,
  selectedAddressId,
  onSelectAddress,
  onUseNewAddress,
  onBack,
  onContinue,
}: SavedAddressesStepProps) => {
  const isValid =
    selectedAddressId !== null;

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#6f9900]">
          <MapPin size={21} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
            Paso 2
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Elige una dirección
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Selecciona una de tus direcciones guardadas o agrega una nueva.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
            <Loader2
              size={20}
              className="animate-spin text-[#0066FF]"
            />

            Cargando direcciones...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      {!loading &&
        !error &&
        addresses.length > 0 && (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {addresses.map((address) => {
              const selected =
                selectedAddressId ===
                address.id;

              return (
                <button
                  key={address.id}
                  type="button"
                  onClick={() =>
                    onSelectAddress(
                      address.id
                    )
                  }
                  className={`rounded-[1.5rem] border-2 p-5 text-left transition ${
                    selected
                      ? "border-[#0066FF] bg-[#f7faff] shadow-[0_12px_35px_rgba(0,102,255,0.10)]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        selected
                          ? "bg-[#0066FF]/10 text-[#0066FF]"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <MapPin size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900">
                          {address.label ||
                            "Dirección"}
                        </h3>

                        {address.defaultAddress && (
                          <span className="rounded-full bg-[#97cf00]/15 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-[#5f8200]">
                            Predeterminada
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
                        {address.street}{" "}
                        {address.number}
                      </p>

                      {address.apartment && (
                        <p className="text-xs leading-5 text-slate-500">
                          {address.apartment}
                        </p>
                      )}

                      <p className="text-xs leading-5 text-slate-500">
                        {address.city},{" "}
                        {address.region}
                      </p>

                      {address.extraInfo && (
                        <p className="mt-2 text-[11px] leading-5 text-slate-400">
                          {address.extraInfo}
                        </p>
                      )}
                    </div>

                    <div
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected
                          ? "border-[#0066FF]"
                          : "border-slate-300"
                      }`}
                    >
                      {selected && (
                        <div className="h-2.5 w-2.5 rounded-full bg-[#0066FF]" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

      {!loading &&
        !error &&
        addresses.length === 0 && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
            <MapPin
              size={26}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 text-lg font-black text-slate-900">
              No tienes direcciones guardadas
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Agrega una dirección para continuar con el despacho.
            </p>
          </div>
        )}

      <button
        type="button"
        onClick={onUseNewAddress}
        className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-[#0066FF]/20 bg-[#0066FF]/5 px-6 text-xs font-black uppercase text-[#0066FF] transition hover:border-[#0066FF]/40 hover:bg-[#0066FF]/10"
      >
        <Plus size={17} />
        Agregar nueva dirección
      </button>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Volver a datos
        </button>

        <button
          type="button"
          onClick={onContinue}
          disabled={!isValid}
          className="group flex min-h-[50px] items-center justify-center gap-3 rounded-xl bg-slate-900 px-7 text-xs font-black uppercase text-white transition hover:bg-[#0066FF] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Usar esta dirección

          <ArrowRight
            size={18}
            className="text-[#97cf00] transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
};

export default SavedAddressesStep;