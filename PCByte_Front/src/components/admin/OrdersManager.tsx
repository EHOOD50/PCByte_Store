import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Eye,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import adminApi from "../../api/adminApi";

import OrderDetailsDrawer from "./orders/OrderDetailsDrawer";
import OrderStatusBadge from "./orders/OrderStatusBadge";
import OrderStatusSelect from "./orders/OrderStatusSelect";

import type {
  OrderDrawerData,
} from "./orders/OrderDetailsDrawer";

import type {
  OrderStatus,
} from "./orders/OrderStatusBadge";

interface OrderItem {
  id?: number;
  productId?: number;
  quantity?: number;
  price?: number;
  productName?: string;

  product?: {
    id?: number;
    name?: string;
    imageUrl?: string | null;
  } | null;
}

interface OrderUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface Order {
  id: number;

  paymentId?: string | number | null;

  userId?: number | null;

  customerEmail?: string;

  email?: string;

  fullName?: string;

  phone?: string;

  street?: string;

  number?: string;

  apartment?: string;

  city?: string;

  region?: string;

  extraInfo?: string;

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

  user?: OrderUser | null;

  /*
   * La entidad Order utiliza orderItems.
   * OrderResponseDTO utiliza items.
   */
  orderItems?: OrderItem[];

  items?: OrderItem[];
}

type StatusFilter =
  | "ALL"
  | OrderStatus;

type NotificationType =
  | "success"
  | "error";

interface NotificationState {
  type: NotificationType;
  message: string;
}

const ITEMS_PER_PAGE = 10;

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
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};

const getCustomerEmail = (
  order: Order
) => {
  return (
    order.customerEmail ??
    order.email ??
    order.user?.email ??
    "Correo no disponible"
  );
};

const getProductName = (
  item: OrderItem
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

const getOrderItems = (
  order: Order
): OrderItem[] => {
  return (
    order.orderItems ??
    order.items ??
    []
  );
};

const toDrawerData = (
  order: Order
): OrderDrawerData => {
  const normalizedItems =
    getOrderItems(
      order
    );

  return {
    id: order.id,

    paymentId:
      order.paymentId,

    userId:
      order.userId,

    customerEmail:
      order.customerEmail,

    email:
      order.email,

    fullName:
      order.fullName,

    phone:
      order.phone,

    street:
      order.street,

    number:
      order.number,

    apartment:
      order.apartment,

    city:
      order.city,

    region:
      order.region,

    extraInfo:
      order.extraInfo,

    subtotal:
      order.subtotal,

    shippingCost:
      order.shippingCost,

    total:
      order.total,

    shippingRateId:
      order.shippingRateId,

    shippingType:
      order.shippingType,

    shippingLabel:
      order.shippingLabel,

    shippingCarrier:
      order.shippingCarrier,

    shippingFree:
      order.shippingFree,

    estimatedMinDays:
      order.estimatedMinDays,

    estimatedMaxDays:
      order.estimatedMaxDays,

    status:
      order.status,

    createdAt:
      order.createdAt,

    user:
      order.user,

    orderItems:
      normalizedItems.map(
        (item) => ({
          id:
            item.id,

          productId:
            item.productId ??
            item.product?.id,

          quantity:
            item.quantity,

          price:
            item.price,

          productName:
            item.productName,

          product:
            item.product
              ? {
                  id:
                    item.product.id,

                  name:
                    item.product.name,

                  imageUrl:
                    item.product
                      .imageUrl,
                }
              : null,
        })
      ),
  };
};

interface OrdersManagerProps {
  selectedOrderId?: number | null;
  onOrderSelectionHandled?: () => void;
}

const OrdersManager = ({
  selectedOrderId: externalSelectedOrderId,
  onOrderSelectionHandled,
}: OrdersManagerProps) => {
  const [
    orders,
    setOrders,
  ] = useState<Order[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    updatingOrderId,
    setUpdatingOrderId,
  ] = useState<number | null>(
    null
  );

  const [
    selectedOrderId,
    setSelectedOrderId,
  ] = useState<number | null>(
    null
  );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    filterStatus,
    setFilterStatus,
  ] = useState<StatusFilter>(
    "ALL"
  );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    notification,
    setNotification,
  ] =
    useState<NotificationState | null>(
      null
    );

  const selectedOrder =
    useMemo(
      () =>
        orders.find(
          (order) =>
            order.id ===
            selectedOrderId
        ) ?? null,
      [
        orders,
        selectedOrderId,
      ]
    );

  const showNotification = (
    type: NotificationType,
    message: string
  ) => {
    setNotification({
      type,
      message,
    });

    window.setTimeout(
      () => {
        setNotification(null);
      },
      3000
    );
  };

  const fetchOrders = async (
    showRefreshState = false
  ) => {
    if (showRefreshState) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response =
        await adminApi.get(
          "/admin/orders"
        );

      const content =
        response.data?._embedded
          ?.orders ??
        response.data?.content ??
        response.data ??
        [];

      setOrders(
        Array.isArray(content)
          ? content
          : []
      );
    } catch (error) {
      console.error(
        "Error al cargar pedidos:",
        error
      );

      showNotification(
        "error",
        "No se pudieron cargar los pedidos."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
  void fetchOrders();
}, []);

useEffect(() => {
  setCurrentPage(1);
}, [
  searchTerm,
  filterStatus,
]);

useEffect(() => {
  if (
    externalSelectedOrderId == null ||
    orders.length === 0
  ) {
    return;
  }

  const orderExists =
    orders.some(
      (order) =>
        order.id ===
        externalSelectedOrderId
    );

  if (!orderExists) {
    showNotification(
      "error",
      `No se encontró el pedido #${externalSelectedOrderId}.`
    );

    onOrderSelectionHandled?.();
    return;
  }

  setSelectedOrderId(
    externalSelectedOrderId
  );
}, [
  externalSelectedOrderId,
  orders,
  onOrderSelectionHandled,
]);

useEffect(() => {
  if (!selectedOrder) {
    return;
  }

  const previousOverflow =
    document.body.style.overflow;

  document.body.style.overflow =
    "hidden";

  const handleKeyDown = (
    event: KeyboardEvent
  ) => {
    if (
      event.key === "Escape"
    ) {
      setSelectedOrderId(
        null
      );

      onOrderSelectionHandled?.();
    }
  };

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () => {
    document.body.style.overflow =
      previousOverflow;

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );
  };
}, [
  selectedOrder,
  onOrderSelectionHandled,
]);

  const filteredOrders =
    useMemo(
      () => {
        const term =
          searchTerm
            .trim()
            .toLowerCase();

        return orders.filter(
          (order) => {
            const status =
              getNormalizedStatus(
                order.status
              );

            const matchesStatus =
              filterStatus ===
                "ALL" ||
              status ===
                filterStatus;

            if (!matchesStatus) {
              return false;
            }

            if (!term) {
              return true;
            }

            const searchableValues =
              [
                order.id,
                order.paymentId,
                order.fullName,
                order.customerEmail,
                order.email,
                order.phone,
                order.city,
                order.region,
              ];

            return searchableValues.some(
              (value) =>
                String(
                  value ?? ""
                )
                  .toLowerCase()
                  .includes(term)
            );
          }
        );
      },
      [
        orders,
        searchTerm,
        filterStatus,
      ]
    );

  const statusCounts =
    useMemo(
      () => {
        return ORDER_STATUSES.reduce<
          Record<
            OrderStatus,
            number
          >
        >(
          (
            accumulator,
            status
          ) => {
            accumulator[status] =
              orders.filter(
                (order) =>
                  getNormalizedStatus(
                    order.status
                  ) === status
              ).length;

            return accumulator;
          },
          {
            PENDIENTE: 0,
            PAGADO: 0,
            PREPARANDO: 0,
            ENVIADO: 0,
            ENTREGADO: 0,
            CANCELADO: 0,
          }
        );
      },
      [orders]
    );

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredOrders.length /
          ITEMS_PER_PAGE
      )
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const currentOrders =
    filteredOrders.slice(
      (
        safeCurrentPage - 1
      ) * ITEMS_PER_PAGE,
      safeCurrentPage *
        ITEMS_PER_PAGE
    );

  const openOrderDetails = (
    orderId: number
  ) => {
    setSelectedOrderId(
      orderId
    );
  };

  const closeOrderDetails = () => {

  setSelectedOrderId(
    null
  );
  onOrderSelectionHandled?.();
  };

  const updateOrderStatus =
    async (
      orderId: number,
      status: OrderStatus
    ) => {
      setUpdatingOrderId(
        orderId
      );

      try {
        await adminApi.patch(
          `/admin/orders/${orderId}/status`,
          {
            status,
          }
        );

        setOrders(
          (currentOrdersState) =>
            currentOrdersState.map(
              (order) =>
                order.id ===
                orderId
                  ? {
                      ...order,
                      status,
                    }
                  : order
            )
        );

        showNotification(
          "success",
          `Pedido #${orderId} actualizado a ${status}.`
        );
      } catch (error) {
        console.error(
          "Error al actualizar el pedido:",
          error
        );

        showNotification(
          "error",
          "No se pudo cambiar el estado del pedido."
        );
      } finally {
        setUpdatingOrderId(
          null
        );
      }
    };

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066FF]" />

          <p className="mt-4 text-sm font-black text-slate-600">
            Cargando pedidos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {notification && (
          <div
            className={`fixed right-5 top-24 z-[400] max-w-sm rounded-2xl border px-5 py-4 text-xs font-black shadow-2xl ${
              notification.type ===
              "success"
                ? "border-[#97cf00]/40 bg-slate-900 text-[#b9e34d]"
                : "border-red-300 bg-red-600 text-white"
            }`}
          >
            {
              notification.message
            }
          </div>
        )}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0066FF]">
                Centro de operaciones
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                Gestión de pedidos
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Revisa clientes, pagos, productos, destinos y estados de preparación o despacho.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 xl:min-w-[320px]">
                <Search
                  size={17}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="search"
                  value={
                    searchTerm
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchTerm(
                      event.target
                        .value
                    )
                  }
                  placeholder="Pedido, cliente, email o pago..."
                  className="w-full bg-transparent py-3.5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={
                  filterStatus
                }
                onChange={(
                  event
                ) =>
                  setFilterStatus(
                    event.target
                      .value as StatusFilter
                  )
                }
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-700 outline-none focus:ring-2 focus:ring-[#0066FF]/20"
              >
                <option value="ALL">
                  Todos los estados
                </option>

                {ORDER_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={() =>
                  void fetchOrders(
                    true
                  )
                }
                disabled={
                  refreshing
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-[#0066FF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={15}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                Actualizar
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {ORDER_STATUSES.map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setFilterStatus(
                    filterStatus ===
                      status
                      ? "ALL"
                      : status
                  )
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  filterStatus ===
                  status
                    ? "border-[#0066FF] bg-[#0066FF]/5 shadow-sm"
                    : "border-slate-200 bg-white hover:border-[#0066FF]/25"
                }`}
              >
                <OrderStatusBadge
                  status={status}
                  compact
                />

                <p className="mt-3 text-2xl font-black text-slate-900">
                  {
                    statusCounts[
                      status
                    ]
                  }
                </p>
              </button>
            )
          )}
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-slate-900">
                Pedidos encontrados
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {
                  filteredOrders.length
                }{" "}
                {filteredOrders.length ===
                1
                  ? "pedido"
                  : "pedidos"}
              </p>
            </div>

            {filterStatus !==
              "ALL" && (
              <button
                type="button"
                onClick={() =>
                  setFilterStatus(
                    "ALL"
                  )
                }
                className="text-[10px] font-black uppercase tracking-wider text-[#0066FF]"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          {currentOrders.length ===
          0 ? (
            <div className="p-12 text-center">
              <ShoppingCart
                size={32}
                className="mx-auto text-slate-300"
              />

              <p className="mt-4 text-sm font-black text-slate-700">
                No se encontraron pedidos
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Revisa la búsqueda o cambia los filtros.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1160px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                      <th className="px-5 py-4">
                        Pedido
                      </th>

                      <th className="px-5 py-4">
                        Cliente
                      </th>

                      <th className="px-5 py-4">
                        Destino
                      </th>

                      <th className="px-5 py-4">
                        Estado
                      </th>

                      <th className="px-5 py-4 text-right">
                        Total
                      </th>

                      <th className="px-5 py-4">
                        Actualizar
                      </th>

                      <th className="px-5 py-4 text-right">
                        Detalle
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {currentOrders.map(
                      (order) => {
                        const status =
                          getNormalizedStatus(
                            order.status
                          );

                        const orderItems =
                          getOrderItems(
                            order
                          );

                        return (
                          <tr
                            key={
                              order.id
                            }
                            tabIndex={0}
                            role="button"
                            onClick={() =>
                              openOrderDetails(
                                order.id
                              )
                            }
                            onKeyDown={(
                              event
                            ) => {
                              if (
                                event.key ===
                                  "Enter" ||
                                event.key ===
                                  " "
                              ) {
                                event.preventDefault();

                                openOrderDetails(
                                  order.id
                                );
                              }
                            }}
                            className="cursor-pointer transition hover:bg-[#0066FF]/[0.035] focus:bg-[#0066FF]/[0.05] focus:outline-none"
                          >
                            <td className="px-5 py-5 align-top">
                              <p className="text-lg font-black text-[#0066FF]">
                                #
                                {
                                  order.id
                                }
                              </p>

                              <p className="mt-1 text-[10px] font-bold text-slate-400">
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>

                              <p className="mt-1 max-w-[150px] truncate text-[9px] font-bold uppercase text-slate-400">
                                Pago:{" "}
                                {order.paymentId ??
                                  "Sin ID"}
                              </p>
                            </td>

                            <td className="px-5 py-5 align-top">
                              <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
                                  <UserRound
                                    size={16}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[220px] truncate text-sm font-black text-slate-900">
                                    {order.fullName ??
                                      "Sin nombre"}
                                  </p>

                                  <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                                    {getCustomerEmail(
                                      order
                                    )}
                                  </p>

                                  <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[8px] font-black uppercase text-slate-500">
                                    {order.userId ||
                                    order.user?.id
                                      ? "Registrado"
                                      : "Invitado"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-5 align-top">
                              <div className="flex max-w-[260px] items-start gap-2">
                                <MapPin
                                  size={15}
                                  className="mt-0.5 shrink-0 text-slate-400"
                                />

                                <div>
                                  <p className="text-xs font-bold leading-5 text-slate-700">
                                    {order.street ??
                                      "Dirección no disponible"}{" "}
                                    {order.number ??
                                      ""}
                                  </p>

                                  <p className="mt-1 text-[10px] font-bold uppercase text-[#0066FF]">
                                    {order.city ??
                                      "Sin ciudad"}

                                    {order.region
                                      ? `, ${order.region}`
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-5 align-top">
                              <OrderStatusBadge
                                status={
                                  status
                                }
                              />

                              <p className="mt-3 text-[10px] text-slate-500">
                                {
                                  orderItems.length
                                }{" "}
                                {orderItems.length ===
                                1
                                  ? "producto"
                                  : "productos"}
                              </p>
                            </td>

                            <td className="px-5 py-5 text-right align-top">
                              <p className="text-base font-black text-slate-900">
                                {formatCurrency(
                                  order.total
                                )}
                              </p>
                            </td>

                            <td
                              className="w-[190px] px-5 py-5 align-top"
                              onClick={(
                                event
                              ) =>
                                event.stopPropagation()
                              }
                              onKeyDown={(
                                event
                              ) =>
                                event.stopPropagation()
                              }
                            >
                              <OrderStatusSelect
                                value={
                                  status
                                }
                                disabled={
                                  updatingOrderId ===
                                  order.id
                                }
                                onChange={(
                                  nextStatus
                                ) =>
                                  void updateOrderStatus(
                                    order.id,
                                    nextStatus
                                  )
                                }
                              />
                            </td>

                            <td className="px-5 py-5 text-right align-top">
                              <button
                                type="button"
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation();

                                  openOrderDetails(
                                    order.id
                                  );
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#0066FF]/20 bg-[#0066FF]/5 px-3 py-2 text-[9px] font-black uppercase tracking-wider text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white"
                              >
                                <Eye
                                  size={14}
                                />

                                Ver
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4 p-4 lg:hidden">
                {currentOrders.map(
                  (order) => {
                    const status =
                      getNormalizedStatus(
                        order.status
                      );

                    const orderItems =
                      getOrderItems(
                        order
                      );

                    return (
                      <article
                        key={
                          order.id
                        }
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xl font-black text-[#0066FF]">
                              #
                              {
                                order.id
                              }
                            </p>

                            <p className="mt-1 text-[10px] font-bold text-slate-400">
                              {formatDate(
                                order.createdAt
                              )}
                            </p>
                          </div>

                          <OrderStatusBadge
                            status={
                              status
                            }
                            compact
                          />
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                          <p className="text-sm font-black text-slate-900">
                            {order.fullName ??
                              "Sin nombre"}
                          </p>

                          <p className="mt-1 break-all text-xs text-slate-500">
                            {getCustomerEmail(
                              order
                            )}
                          </p>
                        </div>

                        <div className="mt-4 flex items-start gap-3">
                          <MapPin
                            size={16}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />

                          <div>
                            <p className="text-xs font-bold leading-5 text-slate-700">
                              {order.street ??
                                "Dirección no disponible"}{" "}
                              {order.number ??
                                ""}
                            </p>

                            <p className="mt-1 text-[10px] font-black uppercase text-[#0066FF]">
                              {order.city ??
                                "Sin ciudad"}

                              {order.region
                                ? `, ${order.region}`
                                : ""}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                          <div className="flex items-center gap-2">
                            <Package
                              size={16}
                              className="text-slate-400"
                            />

                            <p className="text-xs font-bold text-slate-600">
                              {
                                orderItems.length
                              }{" "}
                              {orderItems.length ===
                              1
                                ? "producto"
                                : "productos"}
                            </p>
                          </div>

                          <p className="text-lg font-black text-slate-900">
                            {formatCurrency(
                              order.total
                            )}
                          </p>
                        </div>

                        <div className="mt-4">
                          <OrderStatusSelect
                            value={
                              status
                            }
                            disabled={
                              updatingOrderId ===
                              order.id
                            }
                            onChange={(
                              nextStatus
                            ) =>
                              void updateOrderStatus(
                                order.id,
                                nextStatus
                              )
                            }
                          />
                        </div>

                        {orderItems.length >
                          0 && (
                          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                            {orderItems.map(
                              (
                                item,
                                index
                              ) => (
                                <p
                                  key={`${order.id}-${item.id ?? item.productId ?? index}`}
                                  className="text-[10px] font-bold uppercase text-slate-500"
                                >
                                  {item.quantity ??
                                    0}{" "}
                                  ×{" "}
                                  {getProductName(
                                    item
                                  )}
                                </p>
                              )
                            )}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            openOrderDetails(
                              order.id
                            )
                          }
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0066FF]/20 bg-[#0066FF]/5 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white"
                        >
                          <Eye
                            size={15}
                          />

                          Ver detalle
                        </button>
                      </article>
                    );
                  }
                )}
              </div>
            </>
          )}
        </section>

        {totalPages > 1 && (
          <section className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-[10px] font-black uppercase tracking-wider text-slate-400 sm:text-left">
              Página{" "}
              {safeCurrentPage} de{" "}
              {totalPages}
            </p>

            <div className="flex justify-center gap-2">
              <button
                type="button"
                disabled={
                  safeCurrentPage ===
                  1
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(
                        1,
                        page - 1
                      )
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={14}
                />

                Anterior
              </button>

              <button
                type="button"
                disabled={
                  safeCurrentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-[10px] font-black uppercase tracking-wider text-white transition hover:bg-[#0066FF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente

                <ChevronRight
                  size={14}
                />
              </button>
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-[#0066FF]/15 bg-[#0066FF]/5 p-4">
          <div className="flex items-start gap-3">
            <CircleDollarSign
              size={18}
              className="mt-0.5 shrink-0 text-[#0066FF]"
            />

            <p className="text-xs leading-5 text-slate-600">
              Selecciona una fila o pulsa “Ver detalle” para abrir el Drawer (panel lateral deslizante) del pedido.
            </p>
          </div>
        </section>
      </div>

      <OrderDetailsDrawer
        order={
          selectedOrder
            ? toDrawerData(
                selectedOrder
              )
            : null
        }
        isOpen={
          selectedOrder !== null
        }
        updating={
          updatingOrderId ===
          selectedOrder?.id
        }
        onClose={
          closeOrderDetails
        }
        onStatusChange={(
          orderId,
          status
        ) =>
          void updateOrderStatus(
            orderId,
            status
          )
        }
      />
    </>
  );
};

export default OrdersManager;