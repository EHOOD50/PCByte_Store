import type {
  ReactNode,
} from "react";

import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Mail,
  MapPin,
  Package,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import OrderStatusBadge from "./OrderStatusBadge";
import OrderStatusSelect from "./OrderStatusSelect";
import OrderTimeline from "./OrderTimeline";

import type {
  OrderStatus,
} from "./OrderStatusBadge";

interface OrderDrawerProduct {
  id?: number;
  name?: string;
  imageUrl?: string | null;
}

export interface OrderDrawerItem {
  id?: number;
  productId?: number;
  quantity?: number;
  price?: number;
  productName?: string;
  product?: OrderDrawerProduct | null;
}

interface OrderDrawerUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface OrderDrawerData {
  id: number;
  paymentId?: string | number | null;
  userId?: number | null;
  customerEmail?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  street?: string;
  number?: string;
  apartment?: string | null;
  city?: string;
  region?: string;
  extraInfo?: string | null;
  total?: number;
  status?: string | null;
  createdAt?: string;
  user?: OrderDrawerUser | null;

  /*
   * Administración utiliza orderItems.
   * El DTO del Área Cliente utiliza items.
   */
  orderItems?: OrderDrawerItem[];
  items?: OrderDrawerItem[];
}

interface OrderDetailsDrawerProps {
  order: OrderDrawerData | null;
  isOpen: boolean;
  updating?: boolean;

  /*
   * readonly = true:
   * oculta las funciones administrativas.
   */
  readonly?: boolean;

  /*
   * Permite cambiar el encabezado.
   *
   * Administración:
   * "Detalle del pedido"
   *
   * Cliente:
   * "Mi compra"
   */
  title?: string;

  onClose: () => void;

  /*
   * Es opcional porque el cliente no puede
   * modificar el estado de una orden.
   */
  onStatusChange?: (
    orderId: number,
    status: OrderStatus
  ) => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDIENTE",
  "PAGADO",
  "PREPARANDO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

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

const formatDate = (
  value?: string
) => {
  if (!value) {
    return "Fecha no disponible";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat(
    "es-CL",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};

const getCustomerName = (
  order: OrderDrawerData
) => {
  if (
    order.fullName &&
    order.fullName.trim()
  ) {
    return order.fullName.trim();
  }

  const firstName =
    order.user?.firstName?.trim() ??
    "";

  const lastName =
    order.user?.lastName?.trim() ??
    "";

  const completeName =
    `${firstName} ${lastName}`.trim();

  return (
    completeName ||
    "Cliente sin identificar"
  );
};

const getCustomerEmail = (
  order: OrderDrawerData
) => {
  return (
    order.customerEmail ??
    order.email ??
    order.user?.email ??
    "Correo no disponible"
  );
};

const getProductName = (
  item: OrderDrawerItem
) => {
  return (
    item.productName ??
    item.product?.name ??
    "Producto sin identificar"
  );
};

const getNormalizedStatus = (
  status?: string | null
): OrderStatus => {
  const normalized =
    status
      ?.trim()
      .toUpperCase();

  if (
    normalized &&
    ORDER_STATUSES.includes(
      normalized as OrderStatus
    )
  ) {
    return normalized as OrderStatus;
  }

  return "PENDIENTE";
};

const OrderDetailsDrawer = ({
  order,
  isOpen,
  updating = false,
  readonly = false,
  title,
  onClose,
  onStatusChange,
}: OrderDetailsDrawerProps) => {
  if (
    !isOpen ||
    !order
  ) {
    return null;
  }

  const status =
    getNormalizedStatus(
      order.status
    );

  const items =
    order.orderItems ??
    order.items ??
    [];

  const drawerTitle =
    title ??
    (
      readonly
        ? "Mi compra"
        : "Detalle del pedido"
    );

  const customerType =
    readonly ||
    order.userId ||
    order.user?.id
      ? "Cliente registrado"
      : "Compra como invitado";

  const addressLine = [
    order.street,
    order.number,
  ]
    .filter(Boolean)
    .join(" ");

  const locationLine = [
    order.city,
    order.region,
  ]
    .filter(Boolean)
    .join(", ");

  const canUpdateStatus =
    !readonly &&
    Boolean(onStatusChange);

  return (
    <div className="fixed inset-0 z-[300]">
      <button
        type="button"
        aria-label="Cerrar detalle del pedido"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-slate-50 shadow-[-20px_0_60px_rgba(15,23,42,0.22)]">
        <header className="border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                {drawerTitle}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  Pedido #{order.id}
                </h2>

                <OrderStatusBadge
                  status={status}
                />
              </div>

              <p className="mt-2 flex items-center gap-2 text-xs font-bold capitalize text-slate-500">
                <CalendarDays
                  size={14}
                />

                {formatDate(
                  order.createdAt
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              aria-label="Cerrar"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-7">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
                <UserRound
                  size={19}
                />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">
                  Cliente
                </p>

                <h3 className="mt-1 text-base font-black text-slate-900">
                  {getCustomerName(
                    order
                  )}
                </h3>

                <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-slate-500">
                  {customerType}
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InformationItem
                icon={
                  <Mail size={16} />
                }
                label="Correo"
                value={getCustomerEmail(
                  order
                )}
              />

              <InformationItem
                icon={
                  <Phone size={16} />
                }
                label="Teléfono"
                value={
                  order.phone ??
                  "No informado"
                }
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#97cf00]/15 text-[#5f8200]">
                <MapPin
                  size={19}
                />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">
                  Dirección de entrega
                </p>

                <h3 className="mt-1 text-base font-black text-slate-900">
                  {addressLine ||
                    "Dirección no disponible"}
                </h3>

                <p className="mt-1 text-xs font-bold text-[#0066FF]">
                  {locationLine ||
                    "Ciudad no disponible"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <TextDetail
                label="Departamento"
                value={
                  order.apartment ??
                  "No aplica"
                }
              />

              <TextDetail
                label="Información adicional"
                value={
                  order.extraInfo ??
                  "Sin indicaciones"
                }
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CreditCard
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">
                    Información de pago
                  </p>

                  <h3 className="mt-1 text-base font-black text-slate-900">
                    Mercado Pago
                  </h3>
                </div>
              </div>

              <OrderStatusBadge
                status={
                  order.paymentId
                    ? "PAGADO"
                    : "PENDIENTE"
                }
                compact
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <TextDetail
                label="ID de pago"
                value={String(
                  order.paymentId ??
                    "No disponible"
                )}
              />

              <TextDetail
                label="Total confirmado"
                value={formatCurrency(
                  order.total
                )}
                emphasized
              />
            </div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <Package
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">
                    Productos
                  </p>

                  <h3 className="mt-1 text-base font-black text-slate-900">
                    Detalle de la compra
                  </h3>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase text-slate-500">
                {items.length}{" "}
                {items.length === 1
                  ? "producto"
                  : "productos"}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-7 text-center">
                <p className="text-sm font-black text-slate-600">
                  Sin productos registrados
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {items.map(
                  (
                    item,
                    index
                  ) => {
                    const quantity =
                      Number(
                        item.quantity ??
                          0
                      );

                    const unitPrice =
                      Number(
                        item.price ??
                          0
                      );

                    const subtotal =
                      quantity *
                      unitPrice;

                    return (
                      <div
                        key={
                          item.id ??
                          item.productId ??
                          `${order.id}-${index}`
                        }
                        className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white">
                          {item.product
                            ?.imageUrl ? (
                            <img
                              src={
                                item
                                  .product
                                  .imageUrl
                              }
                              alt={getProductName(
                                item
                              )}
                              className="h-full w-full object-contain p-1.5"
                            />
                          ) : (
                            <Package
                              size={19}
                              className="text-slate-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black leading-5 text-slate-900">
                            {getProductName(
                              item
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {quantity} ×{" "}
                            {formatCurrency(
                              unitPrice
                            )}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-black text-slate-900">
                          {formatCurrency(
                            subtotal
                          )}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Total del pedido
              </p>

              <p className="text-2xl font-black tracking-tight text-slate-900">
                {formatCurrency(
                  order.total
                )}
              </p>
            </div>
          </section>

          <OrderTimeline
            status={status}
          />

          {canUpdateStatus && (
            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <CircleDollarSign
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">
                    Gestión operativa
                  </p>

                  <h3 className="mt-1 text-base font-black text-slate-900">
                    Actualizar estado
                  </h3>
                </div>
              </div>

              <div className="mt-5">
                <OrderStatusSelect
                  value={status}
                  disabled={updating}
                  onChange={(
                    nextStatus
                  ) =>
                    onStatusChange?.(
                      order.id,
                      nextStatus
                    )
                  }
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                El estado seleccionado se reflejará en el Dashboard, las alertas y el módulo de logística.
              </p>
            </section>
          )}
        </div>

        <footer className="border-t border-slate-200 bg-white p-5 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-slate-900 px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-[#0066FF]"
          >
            Cerrar detalle
          </button>
        </footer>
      </aside>
    </div>
  );
};

interface InformationItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}

const InformationItem = ({
  icon,
  label,
  value,
}: InformationItemProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-[9px] font-black uppercase tracking-wider">
          {label}
        </p>
      </div>

      <p className="mt-2 break-words text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
};

interface TextDetailProps {
  label: string;
  value: string;
  emphasized?: boolean;
}

const TextDetail = ({
  label,
  value,
  emphasized = false,
}: TextDetailProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 break-words ${
          emphasized
            ? "text-base font-black text-slate-900"
            : "text-xs font-bold text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default OrderDetailsDrawer;