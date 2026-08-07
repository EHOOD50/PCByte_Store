import type {
  ReactNode,
} from "react";

import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Truck,
  UserRound,
  X,
  XCircle,
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

  paymentId?:
    | string
    | number
    | null;

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

  subtotal?: number;
  shippingCost?: number;
  total?: number;

  shippingRateId?: number | null;
  shippingType?: string | null;
  shippingLabel?: string | null;
  shippingCarrier?: string | null;
  shippingFree?: boolean;

  estimatedMinDays?: number | null;
  estimatedMaxDays?: number | null;

  status?: string | null;
  createdAt?: string;

  paidAt?: string | null;
  preparingAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;

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
   * Administración:
   * "Detalle del pedido"
   *
   * Cliente:
   * "Mi compra"
   */
  title?: string;

  processingClientAction?: boolean;

  onRetryPayment?: (
    orderId: number
  ) => void;

  onCancelOrder?: (
    orderId: number
  ) => void;

  onClose: () => void;

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
  value:
    | number
    | null
    | undefined
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
    order.user?.firstName
      ?.trim() ?? "";

  const lastName =
    order.user?.lastName
      ?.trim() ?? "";

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

const getShippingTypeLabel = (
  shippingType?: string | null
) => {
  if (!shippingType) {
    return "No informado";
  }

  const normalized =
    shippingType
      .trim()
      .toUpperCase();

  switch (normalized) {
    case "HOME_DELIVERY":
      return "Despacho a domicilio";

    case "EXPRESS":
    case "EXPRESS_DELIVERY":
      return "Despacho express";

    case "STORE_PICKUP":
    case "PICKUP":
      return "Retiro";

    default:
      return shippingType
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(
          /(^|\s)\S/g,
          (letter) =>
            letter.toUpperCase()
        );
  }
};

const getEstimatedDeliveryText = (
  minDays?: number | null,
  maxDays?: number | null
) => {
  if (
    minDays == null &&
    maxDays == null
  ) {
    return "No informado";
  }

  if (
    minDays != null &&
    maxDays != null
  ) {
    if (
      minDays === maxDays
    ) {
      return `${minDays} ${
        minDays === 1
          ? "día hábil"
          : "días hábiles"
      }`;
    }

    return `${minDays} a ${maxDays} días hábiles`;
  }

  if (minDays != null) {
    return `Desde ${minDays} ${
      minDays === 1
        ? "día hábil"
        : "días hábiles"
    }`;
  }

  return `Hasta ${maxDays} ${
    maxDays === 1
      ? "día hábil"
      : "días hábiles"
  }`;
};

const calculateItemsSubtotal = (
  items: OrderDrawerItem[]
) => {
  return items.reduce(
    (
      accumulator,
      item
    ) => {
      const quantity =
        Number(
          item.quantity ?? 0
        );

      const price =
        Number(
          item.price ?? 0
        );

      return (
        accumulator +
        quantity * price
      );
    },
    0
  );
};

const OrderDetailsDrawer = ({
  order,
  isOpen,
  updating = false,
  readonly = false,
  title,
  processingClientAction = false,
  onRetryPayment,
  onCancelOrder,
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

  const paymentStatus: OrderStatus =
  order.paymentId ||
  status === "PAGADO" ||
  status === "PREPARANDO" ||
  status === "ENVIADO" ||
  status === "ENTREGADO"
    ? "PAGADO"
    : status === "CANCELADO"
      ? "CANCELADO"
      : "PENDIENTE";

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
  Boolean(onStatusChange) &&
  status !== "ENTREGADO" &&
  status !== "CANCELADO";

  const canManagePendingOrder =
    readonly &&
    status === "PENDIENTE" &&
    Boolean(onRetryPayment) &&
    Boolean(onCancelOrder);

  const calculatedSubtotal =
    calculateItemsSubtotal(
      items
    );

  const subtotal =
    order.subtotal ??
    calculatedSubtotal;

  const shippingCost =
    order.shippingCost ??
    Math.max(
      Number(order.total ?? 0) -
        subtotal,
      0
    );

  const isFreeShipping =
    order.shippingFree === true ||
    shippingCost === 0;

  const shippingMethod =
    order.shippingLabel?.trim() ||
    getShippingTypeLabel(
      order.shippingType
    );

  const shippingCarrier =
    order.shippingCarrier?.trim() ||
    "No informado";

  const estimatedDelivery =
    getEstimatedDeliveryText(
      order.estimatedMinDays,
      order.estimatedMaxDays
    );

  const productCount =
    items.reduce(
      (
        totalQuantity,
        item
      ) =>
        totalQuantity +
        Number(
          item.quantity ?? 0
        ),
      0
    );

  return (
    <div className="fixed inset-0 z-[300]">
      <button
        type="button"
        aria-label="Cerrar detalle del pedido"
        onClick={onClose}
        disabled={
          processingClientAction
        }
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-slate-50 shadow-[-20px_0_60px_rgba(15,23,42,0.22)]">
        <header className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                {drawerTitle}
              </p>

              <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black tracking-tight text-slate-900">
                  Pedido #{order.id}
                </h2>

                <OrderStatusBadge
                  status={status}
                />
              </div>

              <p className="mt-1.5 flex items-center gap-2 text-[11px] font-bold capitalize text-slate-500">
                <CalendarDays
                  size={13}
                />

                {formatDate(
                  order.createdAt
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={
                processingClientAction
              }
              aria-label="Cerrar"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={17} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <HeaderMetric
              label="Total"
              value={formatCurrency(
                order.total
              )}
            />

            <HeaderMetric
              label="Productos"
              value={String(
                productCount
              )}
            />

            <HeaderMetric
  label="Pago"
  value={
    status === "PENDIENTE"
      ? "Pendiente"
      : status === "CANCELADO"
        ? order.paymentId
          ? "Mercado Pago"
          : "Sin pago"
        : "Mercado Pago"
  }
/>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          <section className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeader
              icon={
                <UserRound
                  size={17}
                />
              }
              iconClassName="bg-[#0066FF]/10 text-[#0066FF]"
              eyebrow="Cliente"
              title={getCustomerName(
                order
              )}
              badge={customerType}
            />

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <InformationItem
                icon={
                  <Mail size={15} />
                }
                label="Correo"
                value={getCustomerEmail(
                  order
                )}
              />

              <InformationItem
                icon={
                  <Phone size={15} />
                }
                label="Teléfono"
                value={
                  order.phone ??
                  "No informado"
                }
              />
            </div>
          </section>

          <section className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeader
              icon={
                <MapPin size={17} />
              }
              iconClassName="bg-[#97cf00]/15 text-[#5f8200]"
              eyebrow="Dirección de entrega"
              title={
                addressLine ||
                "Dirección no disponible"
              }
              description={
                locationLine ||
                "Ciudad no disponible"
              }
            />

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
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

          <section className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
            <SectionHeader
              icon={
                <Truck size={17} />
              }
              iconClassName="bg-orange-50 text-orange-600"
              eyebrow="Información de despacho"
              title={shippingMethod}
            />

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <TextDetail
                label="Transportista"
                value={
                  shippingCarrier
                }
              />

              <TextDetail
                label="Entrega estimada"
                value={
                  estimatedDelivery
                }
              />

              <TextDetail
                label="Costo de despacho"
                value={
                  isFreeShipping
                    ? "Gratis"
                    : formatCurrency(
                        shippingCost
                      )
                }
                emphasized
              />

              <TextDetail
                label="Tipo de despacho"
                value={getShippingTypeLabel(
                  order.shippingType
                )}
              />
            </div>
          </section>

          <section className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <SectionHeader
                icon={
                  <CreditCard
                    size={17}
                  />
                }
                iconClassName="bg-blue-50 text-blue-600"
                eyebrow="Información de pago"
                title="Mercado Pago"
              />

              <OrderStatusBadge
                status={
                  paymentStatus
                }
                compact
              />
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <TextDetail
                label="ID de pago"
                value={String(
                  order.paymentId ??
                  "No disponible"
                )}
              />

              <TextDetail
                label={
                  status ===
                  "CANCELADO"
                    ? "Total del pedido"
                    : "Total confirmado"
                }
                value={formatCurrency(
                  order.total
                )}
                emphasized
              />
            </div>
          </section>

          <section className="rounded-[1.4rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <SectionHeader
                icon={
                  <Package size={17} />
                }
                iconClassName="bg-violet-50 text-violet-600"
                eyebrow="Productos"
                title="Detalle de la compra"
              />

              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[8px] font-black uppercase text-slate-500">
                {items.length}{" "}
                {items.length === 1
                  ? "producto"
                  : "productos"}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <p className="text-xs font-black text-slate-600">
                  Sin productos registrados
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">
                {items.map(
                  (
                    item,
                    index
                  ) => {
                    const quantity =
                      Number(
                        item.quantity ?? 0
                      );

                    const unitPrice =
                      Number(
                        item.price ?? 0
                      );

                    const itemSubtotal =
                      quantity *
                      unitPrice;

                    return (
                      <div
                        key={
                          item.id ??
                          item.productId ??
                          `${order.id}-${index}`
                        }
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
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
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <Package
                              size={17}
                              className="text-slate-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-[13px] font-black leading-4 text-slate-900">
                            {getProductName(
                              item
                            )}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {quantity}{" "}
                            {quantity === 1
                              ? "unidad"
                              : "unidades"}{" "}
                            ·{" "}
                            {formatCurrency(
                              unitPrice
                            )}{" "}
                            c/u
                          </p>
                        </div>

                        <p className="shrink-0 text-[13px] font-black text-slate-900">
                          {formatCurrency(
                            itemSubtotal
                          )}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            <div className="mt-4 space-y-2.5 border-t border-slate-200 pt-4">
              <SummaryRow
                label="Subtotal"
                value={formatCurrency(
                  subtotal
                )}
              />

              <SummaryRow
                label="Despacho"
                value={
                  isFreeShipping
                    ? "Gratis"
                    : formatCurrency(
                        shippingCost
                      )
                }
              />

              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  Total del pedido
                </p>

                <p className="text-xl font-black tracking-tight text-slate-900">
                  {formatCurrency(
                    order.total
                  )}
                </p>
              </div>
            </div>
          </section>

          <OrderTimeline
          status={status}
          createdAt={order.createdAt}
          paidAt={order.paidAt}
          preparingAt={order.preparingAt}
          shippedAt={order.shippedAt}
          deliveredAt={order.deliveredAt}
          cancelledAt={order.cancelledAt}
          />

          {canUpdateStatus && (
            <section className="rounded-[1.4rem] border border-[#0066FF]/20 bg-white p-4 shadow-sm">
              <SectionHeader
                icon={
                  <CircleDollarSign
                    size={17}
                  />
                }
                iconClassName="bg-amber-50 text-amber-600"
                eyebrow="Siguiente acción"
                title="Continuar flujo del pedido"
                description="Solo se muestra la siguiente transición válida."
              />

              <div className="mt-4">
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
            </section>
          )}
        </div>

        {canManagePendingOrder && (
          <footer className="border-t border-slate-200 bg-white p-4 sm:px-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  onCancelOrder?.(
                    order.id
                  )
                }
                disabled={
                  processingClientAction
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-wider text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processingClientAction ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <XCircle
                    size={15}
                  />
                )}

                Cancelar orden
              </button>

              <button
                type="button"
                onClick={() =>
                  onRetryPayment?.(
                    order.id
                  )
                }
                disabled={
                  processingClientAction
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-[#0052cc] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processingClientAction ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <RotateCcw
                    size={15}
                  />
                )}

                Realizar pago
              </button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
};

interface SectionHeaderProps {
  icon: ReactNode;
  iconClassName: string;
  eyebrow: string;
  title: string;
  description?: string;
  badge?: string;
}

const SectionHeader = ({
  icon,
  iconClassName,
  eyebrow,
  title,
  description,
  badge,
}: SectionHeaderProps) => {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[8px] font-black uppercase tracking-[0.17em] text-slate-400">
          {eyebrow}
        </p>

        <h3 className="mt-0.5 text-sm font-black leading-5 text-slate-900">
          {title}
        </h3>

        {description && (
          <p className="mt-0.5 text-[10px] font-bold leading-4 text-[#0066FF]">
            {description}
          </p>
        )}

        {badge && (
          <span className="mt-1.5 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[7px] font-black uppercase tracking-wider text-slate-500">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

interface HeaderMetricProps {
  label: string;
  value: string;
}

const HeaderMetric = ({
  label,
  value,
}: HeaderMetricProps) => {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[7px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[11px] font-black text-slate-900">
        {value}
      </p>
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-[8px] font-black uppercase tracking-wider">
          {label}
        </p>
      </div>

      <p className="mt-1.5 break-words text-[11px] font-bold leading-4 text-slate-700">
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-[8px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1.5 break-words leading-4 ${
          emphasized
            ? "text-[13px] font-black text-slate-900"
            : "text-[11px] font-bold text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

interface SummaryRowProps {
  label: string;
  value: string;
}

const SummaryRow = ({
  label,
  value,
}: SummaryRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-[11px] font-bold text-slate-500">
        {label}
      </p>

      <p className="text-[13px] font-black text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default OrderDetailsDrawer;