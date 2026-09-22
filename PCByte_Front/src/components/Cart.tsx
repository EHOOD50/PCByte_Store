import React from "react";

import {
  ArrowRight,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import type {
  CartItem,
} from "../types/types";

interface CartProps {
  cart: CartItem[];

  onClose: () => void;

  onRemove: (
    id: number
  ) => void;

  onUpdateQuantity: (
    id: number,
    delta: number
  ) => void;

  onClear: () => void;

  onCheckout: () => void;
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

const Cart: React.FC<CartProps> = ({
  cart,
  onClose,
  onRemove,
  onUpdateQuantity,
  onClear,
  onCheckout,
}) => {
  const subtotal =
    React.useMemo(
      () =>
        cart.reduce(
          (
            accumulator,
            item
          ) => {
            const price =
              item?.product
                ?.price ?? 0;

            const quantity =
              item?.quantity ?? 0;

            return (
              accumulator +
              price * quantity
            );
          },
          0
        ),
      [cart]
    );

  const totalUnits =
    React.useMemo(
      () =>
        cart.reduce(
          (
            accumulator,
            item
          ) =>
            accumulator +
            (item.quantity ?? 0),
          0
        ),
      [cart]
    );

  const totalProducts =
    cart.length;

  return (
    <aside className="flex h-full flex-col overflow-hidden bg-[#f8fafc] text-slate-900 shadow-2xl">
      {/* HEADER */}
      <header className="shrink-0 border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#97cf00]/15 text-[#5f8200]">
              <ShoppingBag
                size={19}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
                Compra PCByte
              </p>

              <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Tu carrito
                </h2>

                {cart.length > 0 && (
                  <span className="text-[10px] font-bold text-slate-400">
                    {totalUnits}{" "}
                    {totalUnits === 1
                      ? "unidad"
                      : "unidades"}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        </div>
      </header>

      {/* PRODUCTOS */}
      <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        {cart.length === 0 ? (
          <div className="flex min-h-full items-center justify-center py-10">
            <div className="w-full max-w-xs text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-slate-200 bg-white text-slate-300 shadow-sm">
                <ShoppingBag
                  size={28}
                  strokeWidth={1.7}
                />
              </div>

              <h3 className="mt-5 text-lg font-black tracking-tight text-slate-900">
                Tu carrito está vacío
              </h3>

              <p className="mx-auto mt-2 max-w-[250px] text-xs leading-5 text-slate-500">
                Explora nuestro catálogo y agrega los productos que necesitas.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#0066FF]"
              >
                Explorar productos
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                Productos
              </p>

              <p className="text-[10px] font-bold text-slate-400">
                {totalProducts}{" "}
                {totalProducts === 1
                  ? "producto"
                  : "productos"}
              </p>
            </div>

            <div className="space-y-3">
              {cart.map(
                (
                  item,
                  index
                ) => {
                  const product =
                    item.product;

                  const quantity =
                    item.quantity;

                  const itemSubtotal =
                    (product?.price ??
                      0) *
                    (quantity ?? 0);

                  const hasImage =
                    Boolean(
                      product?.imageUrl
                    );

                  const reachedStock =
                    quantity >=
                    product.stock;

                  return (
                    <article
                      key={
                        product?.id ??
                        index
                      }
                      className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-[0_3px_14px_rgba(15,23,42,0.04)] transition hover:border-slate-300"
                    >
                      <div className="flex gap-4">
                        {/* IMAGEN */}
                        <div className="flex h-[74px] w-[74px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-2">
                          {hasImage ? (
                            <img
                              src={
                                product.imageUrl ??
                                ""
                              }
                              alt={
                                product.name
                              }
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <PackageCheck
                              size={23}
                              className="text-slate-300"
                            />
                          )}
                        </div>

                        {/* INFORMACIÓN */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-[13px] font-black leading-[18px] text-slate-900">
                                {
                                  product.name
                                }
                              </h3>

                              <p className="mt-1 text-xs font-black text-[#0066FF]">
                                {formatCurrency(
                                  product.price
                                )}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                onRemove(
                                  product.id
                                )
                              }
                              aria-label={`Eliminar ${product.name} del carrito`}
                              title="Eliminar producto"
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2
                                size={15}
                              />
                            </button>
                          </div>

                          {/* CANTIDAD + SUBTOTAL */}
                          <div className="mt-3 flex items-end justify-between gap-3">
                            <div>
                              <p className="mb-1.5 text-[8px] font-black uppercase tracking-wider text-slate-400">
                                Cantidad
                              </p>

                              <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      product.id,
                                      -1
                                    )
                                  }
                                  aria-label={`Disminuir cantidad de ${product.name}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-[#0066FF]"
                                >
                                  <Minus
                                    size={13}
                                  />
                                </button>

                                <span className="min-w-8 text-center text-xs font-black text-slate-900">
                                  {
                                    quantity
                                  }
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      product.id,
                                      1
                                    )
                                  }
                                  disabled={
                                    reachedStock
                                  }
                                  aria-label={`Aumentar cantidad de ${product.name}`}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white hover:text-[#0066FF] disabled:cursor-not-allowed disabled:text-slate-300"
                                >
                                  <Plus
                                    size={13}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
                                Subtotal
                              </p>

                              <p className="mt-1 text-base font-black tracking-tight text-slate-900">
                                {formatCurrency(
                                  itemSubtotal
                                )}
                              </p>
                            </div>
                          </div>

                          {reachedStock && (
                            <p className="mt-2 text-[9px] font-bold text-amber-600">
                              Stock máximo disponible.
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            {/* VACIAR CARRITO */}
            <div className="mt-4 flex justify-end px-1">
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400 transition hover:text-red-500"
              >
                <Trash2
                  size={12}
                />

                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>

      {/* FOOTER */}
      {cart.length > 0 && (
        <footer className="shrink-0 border-t border-slate-200 bg-white px-5 pb-5 pt-4 sm:px-6">
          {/* RESUMEN */}
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                Subtotal
              </p>

              <p className="mt-1 text-[10px] leading-4 text-slate-400">
                IVA Incluido
              </p>
            </div>

            <p className="text-[28px] font-black leading-none tracking-tight text-[#0066FF]">
              {formatCurrency(
                subtotal
              )}
            </p>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#97cf00]/25 bg-[#97cf00]/5 px-3 py-2.5">
            <PackageCheck
              size={15}
              className="mt-0.5 shrink-0 text-[#6f9900]"
            />

            <p className="text-[9px] leading-4 text-slate-500">
              El despacho se calculará en el checkout según la dirección seleccionada.
            </p>
          </div>

          {/* ACCIÓN PRINCIPAL */}
          <button
            type="button"
            onClick={
              onCheckout
            }
            className="group mt-4 flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-wide text-white transition hover:bg-[#0066FF]"
          >
            Continuar con la compra

            <ArrowRight
              size={17}
              className="text-[#97cf00] transition-transform group-hover:translate-x-1"
            />
          </button>

          {/* ACCIÓN SECUNDARIA */}
          <button
            type="button"
            onClick={onClose}
            className="mt-2.5 flex min-h-[36px] w-full items-center justify-center text-[9px] font-black uppercase tracking-wider text-slate-400 transition hover:text-[#0066FF]"
          >
            Seguir comprando
          </button>
        </footer>
      )}
    </aside>
  );
};

export default Cart;