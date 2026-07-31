import {
  useEffect,
  useState,
} from "react";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Clock3,
  LoaderCircle,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import api from "../../api/axios";

export type ShippingMethod =
  | "home_delivery";

export interface ShippingQuote {
  shippingRateId: number;

  shippingType: string;

  label: string;

  carrier: string;

  originalPrice: number;

  cost: number;

  freeShipping: boolean;

  freeShippingFrom: number | null;

  estimatedMinDays: number;

  estimatedMaxDays: number;

  available: boolean;

  message: string | null;
}

interface ShippingStepProps {
  selectedMethod: ShippingMethod | null;

  onSelectMethod: (
    method: ShippingMethod
  ) => void;

  /*
   * Estas propiedades serán enviadas desde CheckoutPage.
   *
   * Se mantienen opcionales durante la integración para
   * no romper el archivo padre antes de actualizarlo.
   */
  region?: string;

  city?: string;

  subtotal?: number;

  selectedQuote?: ShippingQuote | null;

  onQuoteChange?: (
    quote: ShippingQuote | null
  ) => void;

  onBack: () => void;

  onContinue: () => void;
}

interface ShippingQuoteResponse {
  shippingRateId?: number;

  shippingType?: string;

  label?: string;

  carrier?: string;

  originalPrice?: number;

  cost?: number;

  freeShipping?: boolean;

  freeShippingFrom?: number | null;

  estimatedMinDays?: number;

  estimatedMaxDays?: number;

  available?: boolean;

  message?: string | null;
}

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

const getEstimatedDeliveryText = (
  quote: ShippingQuote
) => {
  const minimumDays =
    quote.estimatedMinDays;

  const maximumDays =
    quote.estimatedMaxDays;

  if (
    minimumDays === maximumDays
  ) {
    return `${minimumDays} ${
      minimumDays === 1
        ? "día hábil"
        : "días hábiles"
    }`;
  }

  return `${minimumDays} a ${maximumDays} días hábiles`;
};

const normalizeShippingQuote = (
  response:
    ShippingQuoteResponse
): ShippingQuote | null => {
  const shippingRateId =
    Number(
      response.shippingRateId
    );

  if (
    !Number.isInteger(
      shippingRateId
    ) ||
    shippingRateId <= 0
  ) {
    return null;
  }

  return {
    shippingRateId,

    shippingType:
      response.shippingType ??
      "HOME_DELIVERY",

    label:
      response.label ??
      "Despacho a domicilio",

    carrier:
      response.carrier ??
      "Transportista no informado",

    originalPrice:
      Number(
        response.originalPrice ??
          response.cost ??
          0
      ),

    cost:
      Number(
        response.cost ?? 0
      ),

    freeShipping:
      response.freeShipping ??
      false,

    freeShippingFrom:
      response.freeShippingFrom !==
        undefined &&
      response.freeShippingFrom !==
        null
        ? Number(
            response.freeShippingFrom
          )
        : null,

    estimatedMinDays:
      Number(
        response.estimatedMinDays ??
          0
      ),

    estimatedMaxDays:
      Number(
        response.estimatedMaxDays ??
          response.estimatedMinDays ??
          0
      ),

    available:
      response.available ??
      false,

    message:
      response.message ??
      null,
  };
};

export const ShippingStep = ({
  selectedMethod,
  onSelectMethod,
  region = "",
  city = "",
  subtotal = 0,
  selectedQuote = null,
  onQuoteChange,
  onBack,
  onContinue,
}: ShippingStepProps) => {
  const [
    quote,
    setQuote,
  ] =
    useState<ShippingQuote | null>(
      selectedQuote
    );

  const [
    loadingQuote,
    setLoadingQuote,
  ] = useState(false);

  const [
    quoteError,
    setQuoteError,
  ] = useState("");

  const hasAddress =
    region.trim() !== "" &&
    city.trim() !== "";

  const quoteIntegrationEnabled =
    hasAddress &&
    subtotal >= 0;

  const fetchShippingQuote =
    async () => {
      if (
        !quoteIntegrationEnabled
      ) {
        setQuote(null);

        onQuoteChange?.(
          null
        );

        return;
      }

      setLoadingQuote(
        true
      );

      setQuoteError(
        ""
      );

      try {
        const response =
          await api.get<ShippingQuoteResponse>(
            "/shipping/quote",
            {
              params: {
                region:
                  region.trim(),

                city:
                  city.trim(),

                subtotal,

                shippingType:
                  "HOME_DELIVERY",
              },
            }
          );

        const normalizedQuote =
          normalizeShippingQuote(
            response.data
          );

        if (!normalizedQuote) {
          throw new Error(
            "El servidor devolvió una tarifa de despacho inválida."
          );
        }

        setQuote(
          normalizedQuote
        );

        onQuoteChange?.(
          normalizedQuote
        );

        if (
          !normalizedQuote.available
        ) {
          onSelectMethod(
            "home_delivery"
          );
        }
      } catch (
        requestError: unknown
      ) {
        console.error(
          "Error al cotizar el despacho:",
          requestError
        );

        let errorMessage =
          "No fue posible calcular el despacho para la dirección seleccionada.";

        if (
          requestError instanceof
          Error
        ) {
          errorMessage =
            requestError.message;
        }

        if (
          typeof requestError ===
            "object" &&
          requestError !== null &&
          "response" in requestError
        ) {
          const axiosError =
            requestError as {
              response?: {
                data?:
                  | {
                      message?: string;
                    }
                  | string;
              };
            };

          const responseData =
            axiosError.response
              ?.data;

          if (
            typeof responseData ===
            "string"
          ) {
            errorMessage =
              responseData;
          } else if (
            responseData?.message
          ) {
            errorMessage =
              responseData.message;
          }
        }

        setQuote(
          null
        );

        onQuoteChange?.(
          null
        );

        setQuoteError(
          errorMessage
        );
      } finally {
        setLoadingQuote(
          false
        );
      }
    };

  useEffect(() => {
    if (
      !quoteIntegrationEnabled
    ) {
      return;
    }

    void fetchShippingQuote();
  }, [
    region,
    city,
    subtotal,
  ]);

  useEffect(() => {
    setQuote(
      selectedQuote
    );
  }, [
    selectedQuote,
  ]);

  const displayedQuote =
    quote ??
    selectedQuote;

  const quoteAvailable =
    displayedQuote?.available ??
    false;

  const isSelected =
    selectedMethod ===
      "home_delivery" &&
    (
      !quoteIntegrationEnabled ||
      quoteAvailable
    );

  const isValid =
    quoteIntegrationEnabled
      ? (
          selectedMethod ===
            "home_delivery" &&
          quoteAvailable &&
          displayedQuote !==
            null
        )
      : selectedMethod !==
        null;

  const handleSelect =
    () => {
      if (
        loadingQuote
      ) {
        return;
      }

      if (
        quoteIntegrationEnabled &&
        !quoteAvailable
      ) {
        return;
      }

      onSelectMethod(
        "home_delivery"
      );

      if (displayedQuote) {
        onQuoteChange?.(
          displayedQuote
        );
      }
    };

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
            Selecciona cómo deseas recibir tu compra.
          </p>
        </div>
      </div>

      {loadingQuote && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#0066FF]/20 bg-[#0066FF]/5 p-4">
          <LoaderCircle
            size={18}
            className="shrink-0 animate-spin text-[#0066FF]"
          />

          <div>
            <p className="text-xs font-black text-slate-800">
              Calculando despacho
            </p>

            <p className="mt-1 text-[11px] leading-5 text-slate-500">
              Estamos buscando la tarifa disponible para tu dirección.
            </p>
          </div>
        </div>
      )}

      {quoteError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-red-700">
                No pudimos cotizar el despacho
              </p>

              <p className="mt-1 text-[11px] leading-5 text-red-600">
                {quoteError}
              </p>

              {quoteIntegrationEnabled && (
                <button
                  type="button"
                  onClick={() =>
                    void fetchShippingQuote()
                  }
                  className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-[9px] font-black uppercase tracking-wider text-red-600 transition hover:border-red-300"
                >
                  <RefreshCw
                    size={13}
                  />

                  Reintentar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-5">
        <button
          type="button"
          onClick={
            handleSelect
          }
          disabled={
            loadingQuote ||
            (
              quoteIntegrationEnabled &&
              !quoteAvailable
            )
          }
          className={`w-full rounded-[1.5rem] border-2 p-5 text-left transition ${
            isSelected
              ? "border-[#0066FF] bg-[#f7faff] shadow-[0_12px_35px_rgba(0,102,255,0.10)]"
              : "border-slate-200 bg-white hover:border-slate-300"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                isSelected
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
                    {displayedQuote?.label ??
                      "Despacho a domicilio"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {displayedQuote?.message ||
                      "Enviaremos tu pedido a la dirección seleccionada."}
                  </p>
                </div>

                {displayedQuote ? (
                  <div className="shrink-0 text-left sm:text-right">
                    {displayedQuote.freeShipping ? (
                      <>
                        {displayedQuote.originalPrice >
                          0 && (
                          <p className="text-[10px] font-bold text-slate-400 line-through">
                            {formatCurrency(
                              displayedQuote.originalPrice
                            )}
                          </p>
                        )}

                        <span className="inline-flex rounded-full bg-[#97cf00]/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#5f8200]">
                          Despacho gratis
                        </span>
                      </>
                    ) : (
                      <p className="text-lg font-black text-slate-900">
                        {formatCurrency(
                          displayedQuote.cost
                        )}
                      </p>
                    )}
                  </div>
                ) : (
                  <span className="shrink-0 rounded-full bg-[#97cf00]/15 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#5f8200]">
                    Disponible
                  </span>
                )}
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
                      {hasAddress
                        ? `${city}, ${region}`
                        : "Según región y comuna"}
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
                      {displayedQuote &&
                      displayedQuote.estimatedMinDays >
                        0
                        ? getEstimatedDeliveryText(
                            displayedQuote
                          )
                        : "Se informará antes del pago"}
                    </p>
                  </div>
                </div>
              </div>

              {displayedQuote?.carrier && (
                <div className="mt-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Transportista
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {displayedQuote.carrier}
                  </p>
                </div>
              )}

              {displayedQuote &&
                !displayedQuote.available && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <AlertCircle
                      size={15}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <p className="text-[11px] font-bold leading-5 text-amber-700">
                      {displayedQuote.message ||
                        "No existe una tarifa disponible para esta dirección."}
                    </p>
                  </div>
                )}
            </div>

            <div
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                isSelected
                  ? "border-[#0066FF]"
                  : "border-slate-300"
              }`}
            >
              {isSelected && (
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
          El costo y el plazo del despacho se calculan con la dirección y el subtotal actual de tu compra. El servidor volverá a validar la tarifa antes de crear la orden.
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={
            onBack
          }
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
        >
          <ArrowLeft size={17} />

          Volver a dirección
        </button>

        <button
          type="button"
          onClick={
            onContinue
          }
          disabled={
            !isValid ||
            loadingQuote
          }
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

export default ShippingStep;onkeydown