import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
  UserRound,
} from "lucide-react";

import type {
  CartItem,
} from "../../types/types";

import type {
  GuestInformationData,
} from "./GuestInformationStep";

import type {
  CheckoutAddressData,
} from "./AddressStep";

import type {
  PaymentMethod,
} from "./PaymentStep";

interface ReviewOrderStepProps {
  informationData: GuestInformationData;
  addressData: CheckoutAddressData;

  shippingLabel: string;
  shippingDescription?: string;
  shippingCost?: number;

  paymentMethod: PaymentMethod | null;

  cart: CartItem[];
  total: number;

  isLoading: boolean;

  onBack: () => void;
  onConfirm: () => void;
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

const getPaymentMethodLabel = (
  paymentMethod: PaymentMethod | null
) => {
  switch (paymentMethod) {
    case "mercado_pago":
      return "Mercado Pago";

    default:
      return "No seleccionado";
  }
};

export const ReviewOrderStep = ({
  informationData,
  addressData,
  shippingLabel,
  shippingDescription,
  shippingCost = 0,
  paymentMethod,
  cart,
  total,
  isLoading,
  onBack,
  onConfirm,
}: ReviewOrderStepProps) => {
  const customerName =
    `${informationData.firstName} ${informationData.lastName}`.trim();

  const complement =
    addressData.complementType &&
    addressData.complementDetail
      ? `${addressData.complementType} ${addressData.complementDetail}`
      : addressData.apartment;

  const isValid =
    paymentMethod !== null &&
    cart.length > 0;

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#6f9900]">
          <PackageCheck size={21} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
            Paso 5
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Revisa tu pedido
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Confirma que los datos estén correctos antes de continuar al pago.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
              <UserRound size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Comprador
              </p>

              <p className="mt-2 text-sm font-black text-slate-900">
                {customerName ||
                  "Sin nombre"}
              </p>

              <p className="mt-1 break-words text-xs font-medium text-slate-500">
                {informationData.email}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {informationData.phone}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
              <MapPin size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Dirección de despacho
              </p>

              <p className="mt-2 text-sm font-black text-slate-900">
                {addressData.street}{" "}
                {addressData.number}
              </p>

              {complement && (
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {complement}
                </p>
              )}

              <p className="mt-1 text-xs font-medium text-slate-500">
                {addressData.city},{" "}
                {addressData.region}
              </p>

              {addressData.extraInfo && (
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {
                    addressData.extraInfo
                  }
                </p>
              )}
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
              <Truck size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Despacho
              </p>

              <p className="mt-2 text-sm font-black text-slate-900">
                {shippingLabel ||
                  "Método no seleccionado"}
              </p>

              {shippingDescription && (
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {shippingDescription}
                </p>
              )}

              <p className="mt-2 text-xs font-black text-[#6f9900]">
                {shippingCost > 0
                  ? formatCurrency(
                      shippingCost
                    )
                  : "Sin costo adicional"}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
              <CreditCard size={17} />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Medio de pago
              </p>

              <p className="mt-2 text-sm font-black text-slate-900">
                {getPaymentMethodLabel(
                  paymentMethod
                )}
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                El pago se completará en la plataforma segura del proveedor.
              </p>
            </div>
          </div>
        </article>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <ShoppingBag
            size={17}
            className="text-[#0066FF]"
          />

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
            Productos
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {cart.map((item) => {
            const subtotal =
              item.product.price *
              item.quantity;

            return (
              <article
                key={item.product.id}
                className="flex items-center gap-4 p-4"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {item.product.imageUrl ? (
                    <img
                      src={
                        item.product.imageUrl
                      }
                      alt={
                        item.product.name
                      }
                      className="h-full w-full object-contain p-1"
                    />
                  ) : (
                    <ShoppingBag
                      size={20}
                      className="text-slate-300"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-black text-slate-900">
                    {item.product.name}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Cantidad:{" "}
                    {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    {formatCurrency(
                      subtotal
                    )}
                  </p>

                  {item.quantity > 1 && (
                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                      {formatCurrency(
                        item.product.price
                      )}{" "}
                      c/u
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-black uppercase tracking-wide text-slate-500">
              Total del pedido
            </span>

            <span className="text-xl font-black text-slate-900">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#97cf00]/25 bg-[#97cf00]/5 p-4">
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0 text-[#6f9900]"
        />

        <p className="text-[11px] leading-5 text-slate-600">
          Al continuar serás enviado al proveedor de pago seleccionado. La orden se confirmará únicamente cuando el pago sea aprobado.
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
          Volver a medio de pago
        </button>

        <button
          type="button"
          onClick={onConfirm}
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

              Pagar con Mercado Pago
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default ReviewOrderStep;