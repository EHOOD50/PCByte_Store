import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Package,
  RefreshCw,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import adminApi from "../../api/adminApi";
import {
  getOrderPriority,
} from "../../utils/orderPriority";
import OrderDetailsDrawer from "./orders/OrderDetailsDrawer";
import OrderStatusBadge from "./orders/OrderStatusBadge";
import OrderStatusSelect from "./orders/OrderStatusSelect";
import OrderPriorityBadge from "./orders/OrderPriorityBadge";

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

  paymentId?:
    | string
    | number
    | null;

  userId?: number | null;

  customerEmail?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  userStatus?: string | null;
  street?: string;
  number?: string;
  apartment?: string;
  city?: string;
  region?: string;
  extraInfo?: string;

  subtotal?: number;
  shippingCost?: number;
  total?: number;

  shippingRateId?:
    | number
    | null;

  shippingType?:
    | string
    | null;

  shippingLabel?:
    | string
    | null;

  shippingCarrier?:
    | string
    | null;

  shippingFree?: boolean;

  estimatedMinDays?:
    | number
    | null;

  estimatedMaxDays?:
    | number
    | null;

  status?: string | null;
  createdAt?: string;

  paidAt?: string | null;
  preparingAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;

  user?: OrderUser | null;

  orderItems?: OrderItem[];
  items?: OrderItem[];
}

type StatusFilter =
  | "ALL"
  | OrderStatus
  | "DELIVERED_TODAY"
  | "DELAYED_PREPARATION";

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

const PRIORITY_WEIGHT = {
  URGENT: 0,
  HIGH: 1,
  NORMAL: 2,
  WAITING_PAYMENT: 3,
  IN_TRANSIT: 4,
  FINISHED: 5,
  NO_MANAGEMENT: 6,
} as const;

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
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};

const isSameLocalDay = (
  value?: string | null
) => {
  if (!value) {
    return false;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return false;
  }

  const today =
    new Date();

  return (
    date.getFullYear() ===
      today.getFullYear() &&
    date.getMonth() ===
      today.getMonth() &&
    date.getDate() ===
      today.getDate()
  );
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

const getPriorityReferenceDate = (
  order: Order
) => {
  const status =
    getNormalizedStatus(
      order.status
    );

  let referenceDate:
    | string
    | null
    | undefined;

  switch (status) {
    case "PAGADO":
      referenceDate =
        order.paidAt ??
        order.createdAt;
      break;

    case "PREPARANDO":
      referenceDate =
        order.preparingAt ??
        order.paidAt ??
        order.createdAt;
      break;

    case "ENVIADO":
      referenceDate =
        order.shippedAt ??
        order.preparingAt ??
        order.createdAt;
      break;

    case "ENTREGADO":
      referenceDate =
        order.deliveredAt ??
        order.createdAt;
      break;

    case "CANCELADO":
      referenceDate =
        order.cancelledAt ??
        order.createdAt;
      break;

    case "PENDIENTE":
    default:
      referenceDate =
        order.createdAt;
      break;
  }

  if (!referenceDate) {
    return Number.MAX_SAFE_INTEGER;
  }

  const timestamp =
    new Date(
      referenceDate
    ).getTime();

  return Number.isNaN(
    timestamp
  )
    ? Number.MAX_SAFE_INTEGER
    : timestamp;
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

const getRowPriorityClass = (
  order: Order
) => {
  return getOrderPriority(
    order.status,
    order.paidAt,
    order.preparingAt,
    order.shippedAt
  ).rowClasses;
};

const toDrawerData = (
  order: Order
): OrderDrawerData => {
  const normalizedItems =
    getOrderItems(order);

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

paidAt:
  order.paidAt,

preparingAt:
  order.preparingAt,

shippedAt:
  order.shippedAt,

deliveredAt:
  order.deliveredAt,

cancelledAt:
  order.cancelledAt,

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
  selectedOrderId?:
    | number
    | null;

  onOrderSelectionHandled?:
    () => void;
}

const OrdersManager = ({
  selectedOrderId:
    externalSelectedOrderId,

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
  ] =
    useState<number | null>(
      null
    );

  const [
    selectedOrderId,
    setSelectedOrderId,
  ] =
    useState<number | null>(
      null
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    filterStatus,
    setFilterStatus,
  ] =
    useState<StatusFilter>(
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
      externalSelectedOrderId ==
        null ||
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
      document.body.style
        .overflow;

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

            let matchesStatus = true;

if (filterStatus === "DELIVERED_TODAY") {
  matchesStatus =
    status === "ENTREGADO" &&
    isSameLocalDay(
      order.deliveredAt
    );
} else if (
  filterStatus ===
  "DELAYED_PREPARATION"
) {
  if (
    status !== "PREPARANDO" ||
    !order.preparingAt
  ) {
    matchesStatus = false;
  } else {
    const preparingTime =
      new Date(
        order.preparingAt
      ).getTime();

    const elapsedHours =
      Number.isNaN(
        preparingTime
      )
        ? 0
        : (
            Date.now() -
            preparingTime
          ) /
          3_600_000;

    matchesStatus =
      elapsedHours >= 4;
  }
} else if (
  filterStatus !== "ALL"
) {
  matchesStatus =
    status === filterStatus;
}

if (!matchesStatus) {
  return false;
}

            if (!term) {
              return true;
            }

            const searchableValues = [
            order.id,
            `#${order.id}`,
            order.paymentId,
            order.fullName,
            order.customerEmail,
            order.email,
            order.phone,
            order.street,
            order.number,
            order.apartment,
            order.city,
            order.region,
            order.extraInfo,
            order.shippingLabel,
            order.shippingCarrier,
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

    const prioritizedOrders =
  useMemo(
    () => {
      return [
        ...filteredOrders,
      ].sort(
        (
          firstOrder,
          secondOrder
        ) => {
          const firstPriority =
            getOrderPriority(
              firstOrder.status,
              firstOrder.paidAt,
              firstOrder.preparingAt
            );

          const secondPriority =
            getOrderPriority(
              secondOrder.status,
              secondOrder.paidAt,
              secondOrder.preparingAt
            );

            

          const priorityDifference =
            PRIORITY_WEIGHT[
              firstPriority.priority
            ] -
            PRIORITY_WEIGHT[
              secondPriority.priority
            ];

          if (
            priorityDifference !== 0
          ) {
            return priorityDifference;
          }

          /*
           * Cuando dos pedidos tienen la misma prioridad,
           * el más antiguo aparece primero para respetar
           * el orden operacional.
           */
          const firstReferenceDate =
            getPriorityReferenceDate(
              firstOrder
            );

          const secondReferenceDate =
            getPriorityReferenceDate(
              secondOrder
            );

          return (
            firstReferenceDate -
            secondReferenceDate
          );
        }
      );
    },
    [filteredOrders]
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

    const operationalIndicators =
    useMemo(
    () => {
      const waitingPayment =
        orders.filter(
          (order) =>
            getNormalizedStatus(
              order.status
            ) === "PENDIENTE"
        ).length;

      const readyToPrepare =
        orders.filter(
          (order) =>
            getNormalizedStatus(
              order.status
            ) === "PAGADO"
        ).length;

      const delayedPreparation =
        orders.filter(
          (order) => {
            const status =
              getNormalizedStatus(
                order.status
              );

            if (
              status !==
                "PREPARANDO" ||
              !order.preparingAt
            ) {
              return false;
            }

            const preparingTime =
              new Date(
                order.preparingAt
              ).getTime();

            if (
              Number.isNaN(
                preparingTime
              )
            ) {
              return false;
            }

            const elapsedHours =
              (
                Date.now() -
                preparingTime
              ) /
              3_600_000;

            return (
              elapsedHours >= 4
            );
          }
        ).length;

      const inTransit =
        orders.filter(
          (order) =>
            getNormalizedStatus(
              order.status
            ) === "ENVIADO"
        ).length;

      const deliveredToday =
        orders.filter(
          (order) =>
            getNormalizedStatus(
              order.status
            ) ===
              "ENTREGADO" &&
            isSameLocalDay(
              order.deliveredAt
            )
        ).length;

      const cancelled =
        orders.filter(
          (order) =>
            getNormalizedStatus(
              order.status
            ) === "CANCELADO"
        ).length;

      return {
        waitingPayment,
        readyToPrepare,
        delayedPreparation,
        inTransit,
        deliveredToday,
        cancelled,
      };
    },
    [orders]
  );

  const operationalSummary =
  useMemo(() => {

    const activeOrders =
      orders.filter(order => {
        const status =
          getNormalizedStatus(order.status);

        return (
          status !== "ENTREGADO" &&
          status !== "CANCELADO"
        );
      }).length;

    const urgentOrders =
      orders.filter(order =>
        getOrderPriority(
          order.status,
          order.paidAt,
          order.preparingAt,
          order.shippedAt
        ).priority === "URGENT"
      ).length;

    const preparingOrders =
      orders.filter(order =>
        getNormalizedStatus(order.status) === "PREPARANDO"
      ).length;

    const inTransitOrders =
      orders.filter(order =>
        getNormalizedStatus(order.status) === "ENVIADO"
      ).length;

    return {
      activeOrders,
      urgentOrders,
      preparingOrders,
      inTransitOrders,
    };

  }, [orders]);

  const totalPages =
  Math.max(
    1,
    Math.ceil(
      prioritizedOrders.length /
        ITEMS_PER_PAGE
    )
  );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const currentOrders =
  prioritizedOrders.slice(
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

  const closeOrderDetails =
    () => {
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
      const response =
        await adminApi.patch(
          `/admin/orders/${orderId}/status`,
          {
            status,
          }
        );

      const updatedOrder =
        response.data as Order;

      setOrders(
        (
          currentOrdersState
        ) =>
          currentOrdersState.map(
            (order) =>
              order.id ===
              orderId
                ? {
                    ...order,
                    ...updatedOrder,
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
                Pedidos y despachos
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
  Gestiona pagos, preparación, despacho y entrega de cada pedido desde un solo lugar.
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
  <OperationalIndicatorCard
    title="Esperando pago"
    value={
      operationalIndicators
        .waitingPayment
    }
    description="Aún no ingresan al flujo operativo"
    active={
      filterStatus ===
      "PENDIENTE"
    }
    tone="amber"
    onClick={() =>
      setFilterStatus(
        filterStatus ===
          "PENDIENTE"
          ? "ALL"
          : "PENDIENTE"
      )
    }
  />

  <OperationalIndicatorCard
    title="Listos para preparar"
    value={
      operationalIndicators
        .readyToPrepare
    }
    description="Pagados y pendientes de preparación"
    active={
      filterStatus ===
      "PAGADO"
    }
    tone="blue"
    onClick={() =>
      setFilterStatus(
        filterStatus ===
          "PAGADO"
          ? "ALL"
          : "PAGADO"
      )
    }
  />

  <OperationalIndicatorCard
    title="Preparación atrasada"
    value={
      operationalIndicators
        .delayedPreparation
    }
    description="Más de 4 horas en preparación"
    active={
  filterStatus ===
  "DELAYED_PREPARATION"
}
    tone="red"
    onClick={() =>
  setFilterStatus(
    filterStatus ===
      "DELAYED_PREPARATION"
      ? "ALL"
      : "DELAYED_PREPARATION"
  )
}
  />

  <OperationalIndicatorCard
    title="En ruta"
    value={
      operationalIndicators
        .inTransit
    }
    description="Pedidos entregados al transportista"
    active={
      filterStatus ===
      "ENVIADO"
    }
    tone="cyan"
    onClick={() =>
      setFilterStatus(
        filterStatus ===
          "ENVIADO"
          ? "ALL"
          : "ENVIADO"
      )
    }
  />

  <OperationalIndicatorCard
    title="Entregados hoy"
    value={
      operationalIndicators
        .deliveredToday
    }
    description="Entregas confirmadas durante el día"
    active={
      filterStatus ===
      "ENTREGADO"
    }
    tone="green"
    onClick={() =>
  setFilterStatus(
    filterStatus ===
      "DELIVERED_TODAY"
      ? "ALL"
      : "DELIVERED_TODAY"
  )
}
  />

  <OperationalIndicatorCard
    title="Cancelados"
    value={
      operationalIndicators
        .cancelled
    }
    description="Órdenes fuera del flujo operativo"
    active={
      filterStatus ===
      "CANCELADO"
    }
    tone="slate"
    onClick={() =>
      setFilterStatus(
        filterStatus ===
          "CANCELADO"
          ? "ALL"
          : "CANCELADO"
      )
    }
  />
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
                <table className="w-full min-w-[1080px]">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
                      <th className="px-4 py-3.5">
                        Pedido
                      </th>

                      <th className="px-4 py-3.5">
                        Cliente
                      </th>

                      <th className="px-4 py-3.5">
                        Destino
                      </th>

                      <th className="px-4 py-3.5">
  Estado
</th>

<th className="px-4 py-3.5">
  Prioridad
</th>

<th className="px-4 py-3.5 text-right">
  Total
</th>

                      <th className="px-4 py-3.5">
                        Acción
                      </th>

                      <th className="px-4 py-3.5 text-right">
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
  key={order.id}
  tabIndex={0}
  role="button"
  onClick={() =>
    openOrderDetails(
      order.id
    )
  }
  onKeyDown={(event) => {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      openOrderDetails(
        order.id
      );
    }
  }}
  className={`${getRowPriorityClass(
    order
  )} cursor-pointer transition hover:brightness-[0.99] focus:outline-none`}
>
                            <td className="px-4 py-3 align-middle">
                              <p className="text-base font-black text-[#0066FF]">
                                #
                                {
                                  order.id
                                }
                              </p>

                              <p className="mt-0.5 whitespace-nowrap text-[9px] font-bold text-slate-400">
                                {formatDate(
                                  order.createdAt
                                )}
                              </p>

                              <p className="mt-0.5 max-w-[145px] truncate text-[8px] font-bold uppercase text-slate-400">
                                Pago:{" "}
                                {order.paymentId ??
                                  "Sin ID"}
                              </p>
                            </td>

                            <td className="px-4 py-3 align-middle">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0066FF]/10 text-[#0066FF]">
                                  <UserRound
                                    size={14}
                                  />
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[210px] truncate text-[13px] font-black text-slate-900">
                                    {order.fullName ??
                                      "Sin nombre"}
                                  </p>

                                  <p className="mt-0.5 max-w-[210px] truncate text-[10px] text-slate-500">
                                    {getCustomerEmail(
                                      order
                                    )}
                                  </p>

                                  <span className="mt-1 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[7px] font-black uppercase text-slate-500">
                                    {order.userStatus === "REGISTRADO"
  ? "Registrado"
  : order.userStatus === "PENDIENTE_VERIFICACION"
    ? "Pendiente de verificación"
    : order.userStatus === "BLOQUEADO"
      ? "Bloqueado"
      : "Invitado"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 align-middle">
                              <div className="flex max-w-[235px] items-start gap-2">
                                <MapPin
                                  size={14}
                                  className="mt-0.5 shrink-0 text-slate-400"
                                />

                                <div className="min-w-0">
                                  <p className="line-clamp-2 text-[11px] font-bold leading-4 text-slate-700">
                                    {order.street ??
                                      "Dirección no disponible"}{" "}
                                    {order.number ??
                                      ""}
                                  </p>

                                  <p className="mt-0.5 truncate text-[8px] font-bold uppercase text-[#0066FF]">
                                    {order.city ??
                                      "Sin ciudad"}

                                    {order.region
                                      ? `, ${order.region}`
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 align-middle">
  <OrderStatusBadge
    status={status}
  />

  <p className="mt-1.5 text-[9px] text-slate-500">
    {orderItems.length}{" "}
    {orderItems.length === 1
      ? "producto"
      : "productos"}
  </p>
</td>

<td className="px-4 py-3 align-middle">
  <OrderPriorityBadge
  status={status}
  paidAt={order.paidAt}
  preparingAt={order.preparingAt}
  shippedAt={order.shippedAt}
/>
</td>
<td className="px-4 py-3 text-right align-middle">
                              <p className="whitespace-nowrap text-sm font-black text-slate-900">
                                {formatCurrency(
                                  order.total
                                )}
                              </p>
                            </td>

                            <td
                              className="w-[130px] px-4 py-3 align-middle"
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

                            <td className="px-4 py-3 text-right align-middle">
                              <button
                                type="button"
                                title="Ver detalle del pedido"
                                onClick={(
                                  event
                                ) => {
                                  event.stopPropagation();

                                  openOrderDetails(
                                    order.id
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#0066FF]/20 bg-[#0066FF]/5 px-2.5 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white"
                              >
                                <Eye
                                  size={13}
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

        <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
        Centro operativo
      </p>

      <h3 className="mt-1 text-xl font-black tracking-tight text-slate-900">
        Resumen de la operación
      </h3>

      <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500">
        Estado general de los pedidos que todavía requieren gestión.
      </p>
    </div>

    <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:max-w-4xl xl:grid-cols-4">
      <OperationalSummaryCard
        label="Pedidos activos"
        value={
          operationalSummary.activeOrders
        }
        description="Aún no finalizados"
        tone="blue"
      />

      <OperationalSummaryCard
        label="Urgentes"
        value={
          operationalSummary.urgentOrders
        }
        description="Requieren atención inmediata"
        tone={
          operationalSummary.urgentOrders > 0
            ? "red"
            : "slate"
        }
      />

      <OperationalSummaryCard
        label="Preparando"
        value={
          operationalSummary.preparingOrders
        }
        description="Actualmente en preparación"
        tone="violet"
      />

      <OperationalSummaryCard
        label="En ruta"
        value={
          operationalSummary.inTransitOrders
        }
        description="Entregados al transportista"
        tone="cyan"
      />
    </div>
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

type OperationalTone =
  | "amber"
  | "blue"
  | "red"
  | "cyan"
  | "green"
  | "slate";

interface OperationalIndicatorCardProps {
  title: string;
  value: number;
  description: string;
  active: boolean;
  tone: OperationalTone;
  onClick: () => void;
}

const operationalToneClasses:
  Record<
    OperationalTone,
    {
      border: string;
      background: string;
      value: string;
      dot: string;
    }
  > = {
  amber: {
    border:
      "border-amber-200",
    background:
      "bg-amber-50/60",
    value:
      "text-amber-700",
    dot:
      "bg-amber-500",
  },

  blue: {
    border:
      "border-blue-200",
    background:
      "bg-blue-50/60",
    value:
      "text-blue-700",
    dot:
      "bg-blue-500",
  },

  red: {
    border:
      "border-red-200",
    background:
      "bg-red-50/60",
    value:
      "text-red-700",
    dot:
      "bg-red-500",
  },

  cyan: {
    border:
      "border-cyan-200",
    background:
      "bg-cyan-50/60",
    value:
      "text-cyan-700",
    dot:
      "bg-cyan-500",
  },

  green: {
    border:
      "border-[#97cf00]/35",
    background:
      "bg-[#97cf00]/10",
    value:
      "text-[#5f8200]",
    dot:
      "bg-[#97cf00]",
  },

  slate: {
    border:
      "border-slate-200",
    background:
      "bg-slate-50",
    value:
      "text-slate-600",
    dot:
      "bg-slate-400",
  },
};

const OperationalIndicatorCard = ({
  title,
  value,
  description,
  active,
  tone,
  onClick,
}: OperationalIndicatorCardProps) => {
  const classes =
    operationalToneClasses[
      tone
    ];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-[#0066FF] bg-[#0066FF]/5 shadow-sm"
          : `${classes.border} ${classes.background} hover:-translate-y-0.5 hover:shadow-sm`
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${classes.dot}`}
        />

        <p className="text-[8px] font-black uppercase tracking-[0.16em] text-slate-500">
          {title}
        </p>
      </div>

      <p
        className={`mt-3 text-2xl font-black ${classes.value}`}
      >
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold leading-4 text-slate-500">
        {description}
      </p>
    </button>
  );
};
type OperationalSummaryTone =
  | "blue"
  | "red"
  | "violet"
  | "cyan"
  | "slate";

interface OperationalSummaryCardProps {
  label: string;
  value: number;
  description: string;
  tone: OperationalSummaryTone;
}

const operationalSummaryToneClasses:
  Record<
    OperationalSummaryTone,
    {
      border: string;
      background: string;
      value: string;
      dot: string;
    }
  > = {
  blue: {
    border:
      "border-blue-200",
    background:
      "bg-blue-50/60",
    value:
      "text-blue-700",
    dot:
      "bg-blue-500",
  },

  red: {
    border:
      "border-red-200",
    background:
      "bg-red-50/60",
    value:
      "text-red-700",
    dot:
      "bg-red-500",
  },

  violet: {
    border:
      "border-violet-200",
    background:
      "bg-violet-50/60",
    value:
      "text-violet-700",
    dot:
      "bg-violet-500",
  },

  cyan: {
    border:
      "border-cyan-200",
    background:
      "bg-cyan-50/60",
    value:
      "text-cyan-700",
    dot:
      "bg-cyan-500",
  },

  slate: {
    border:
      "border-slate-200",
    background:
      "bg-slate-50",
    value:
      "text-slate-600",
    dot:
      "bg-slate-400",
  },
};

const OperationalSummaryCard = ({
  label,
  value,
  description,
  tone,
}: OperationalSummaryCardProps) => {
  const classes =
    operationalSummaryToneClasses[
      tone
    ];

  return (
    <div
      className={`rounded-2xl border p-4 ${classes.border} ${classes.background}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${classes.dot}`}
        />

        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>
      </div>

      <p
        className={`mt-3 text-2xl font-black ${classes.value}`}
      >
        {value}
      </p>

      <p className="mt-1 text-[9px] font-bold leading-4 text-slate-500">
        {description}
      </p>
    </div>
  );
};
export default OrdersManager;