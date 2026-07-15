import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  MapPin,
  Search,
} from "lucide-react";

import adminApi from "../../api/adminApi";

interface OrderItem {
  quantity?: number;
  productName?: string;
  product?: {
    name?: string;
  };
}

interface Order {
  id: number;
  paymentId?: string | number | null;
  userId?: number | null;
  customerEmail?: string;
  email?: string;
  fullName?: string;
  street?: string;
  number?: string;
  extraInfo?: string;
  apartment?: string;
  city?: string;
  region?: string;
  total?: number;
  status?: string;
  orderItems?: OrderItem[];
}

const ITEMS_PER_PAGE = 10;

const ORDER_STATUSES = [
  "PENDIENTE",
  "PAGADO",
  "ENVIADO",
  "ENTREGADO",
];

const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [notification, setNotification] =
    useState<string | null>(null);

  const showToast = (message: string) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const response =
        await adminApi.get("/admin/orders");

      const ordersContent =
        response.data?._embedded?.orders ??
        response.data?.content ??
        response.data ??
        [];

      setOrders(
        Array.isArray(ordersContent)
          ? ordersContent
          : []
      );
    } catch (error) {
      console.error(
        "Error al cargar los pedidos:",
        error
      );

      showToast(
        "No se pudieron cargar los pedidos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const filteredOrders = useMemo(() => {
    const term =
      searchTerm.trim().toLowerCase();

    return orders
      .filter((order) => {
        if (!term) {
          return true;
        }

        return (
          order.id
            ?.toString()
            .includes(term) ||
          (order.customerEmail ?? "")
            .toLowerCase()
            .includes(term) ||
          (order.email ?? "")
            .toLowerCase()
            .includes(term) ||
          (order.fullName ?? "")
            .toLowerCase()
            .includes(term) ||
          (order.city ?? "")
            .toLowerCase()
            .includes(term) ||
          (order.paymentId ?? "")
            .toString()
            .toLowerCase()
            .includes(term)
        );
      })
      .filter(
        (order) =>
          filterStatus === "ALL" ||
          order.status === filterStatus
      );
  }, [
    orders,
    searchTerm,
    filterStatus,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length /
        ITEMS_PER_PAGE
    )
  );

  const currentOrders =
    filteredOrders.slice(
      (currentPage - 1) *
        ITEMS_PER_PAGE,
      currentPage *
        ITEMS_PER_PAGE
    );

  const updateOrderStatus = async (
    id: number,
    status: string
  ) => {
    try {
      await adminApi.patch(
        `/admin/orders/${id}/status`,
        { status }
      );

      showToast(
        "Estado actualizado correctamente"
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Error al actualizar el pedido:",
        error
      );

      showToast(
        "No se pudo cambiar el estado"
      );
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-10">
        <p className="text-sm font-bold text-slate-500">
          Cargando pedidos...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {notification && (
        <div className="fixed right-4 top-24 z-[200] rounded-2xl border-b-4 border-[#97cf00] bg-slate-900 px-6 py-3 text-xs font-black uppercase text-[#97cf00] shadow-2xl animate-in slide-in-from-right">
          {notification}
        </div>
      )}

      <div className="flex flex-col gap-5 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
            Administración
          </p>

          <h2 className="mt-1 border-l-4 border-[#0066FF] pl-3 text-xl font-black uppercase italic">
            Logística de despacho
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Revisa clientes, pagos,
            productos, destinos y estados
            de envío.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 lg:min-w-[280px]">
            <Search
              size={17}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Buscar pedido, cliente, email..."
              className="w-full bg-transparent py-4 text-sm font-bold outline-none placeholder:text-slate-400"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(event) =>
              setFilterStatus(
                event.target.value
              )
            }
            className="cursor-pointer rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-xs font-black uppercase outline-none"
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
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {filteredOrders.length} pedido
          {filteredOrders.length !== 1
            ? "s"
            : ""}
        </p>
      </div>

      {currentOrders.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-sm font-black uppercase text-slate-500">
            No se encontraron pedidos
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Revisa los filtros o la
            búsqueda ingresada.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {currentOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-[#0066FF]/30"
            >
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex min-w-[140px] flex-col border-slate-50 pr-4 lg:border-r-2">
                  <span className="text-3xl font-black italic tracking-tighter text-[#0066FF]">
                    #{order.id}
                  </span>

                  <div className="mt-2">
                    <span
                      className={`block rounded-lg border-2 px-2 py-1.5 text-center text-[9px] font-black uppercase ${
                        order.paymentId
                          ? "border-[#97cf00] bg-[#97cf00]/10 text-[#6e9700]"
                          : "border-red-500 bg-red-500/10 text-red-600"
                      }`}
                    >
                      {order.paymentId
                        ? "PAGADO"
                        : "PENDIENTE"}
                    </span>
                  </div>

                  <span className="mt-2 text-[9px] font-bold uppercase text-slate-400">
                    ID:{" "}
                    {order.paymentId ??
                      "MANUAL"}
                  </span>
                </div>

                <div className="flex-[2] space-y-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black uppercase text-slate-900">
                        {order.fullName ??
                          "Sin nombre"}
                      </span>

                      <span
                        className={`rounded-md border px-2 py-0.5 text-[8px] font-black uppercase ${
                          order.userId
                            ? "border-purple-200 bg-purple-100 text-purple-600"
                            : "border-slate-200 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {order.userId
                          ? "• REGISTRADO"
                          : "• INVITADO"}
                      </span>
                    </div>

                    <span className="break-all text-[11px] font-black text-[#0066FF] underline decoration-2 underline-offset-2">
                      {order.customerEmail ??
                        order.email ??
                        "email_no_disponible@pcbyte.cl"}
                    </span>
                  </div>

                  <div className="rounded-2xl border-l-4 border-slate-900 bg-slate-50 p-5">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="mt-1 shrink-0 text-slate-400"
                      />

                      <div className="flex flex-col">
                        <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                          Destino de entrega
                        </span>

                        <span className="text-sm font-black uppercase leading-tight text-slate-800">
                          {order.street ??
                            "Dirección no disponible"}{" "}
                          {order.number ?? ""}
                          {order.extraInfo
                            ? ` • ${order.extraInfo}`
                            : ""}
                          {order.apartment
                            ? ` • DEPTO ${order.apartment}`
                            : ""}
                        </span>

                        <span className="mt-1 text-xs font-black uppercase text-[#0066FF]">
                          {order.city ??
                            "Ciudad no disponible"}
                          {order.region
                            ? `, ${order.region}`
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 border-slate-50 pl-0 lg:border-l-2 lg:pl-6">
                  <span className="mb-2 block text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Productos:
                  </span>

                  <div className="space-y-1">
                    {order.orderItems &&
                    order.orderItems.length >
                      0 ? (
                      order.orderItems.map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={`${order.id}-${index}`}
                            className="text-[10px] font-black uppercase text-slate-600"
                          >
                            •{" "}
                            {item.quantity ??
                              0}
                            x{" "}
                            {item.productName ??
                              item.product
                                ?.name ??
                              "Producto"}
                          </div>
                        )
                      )
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">
                        Sin detalle de
                        productos.
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex min-w-[200px] flex-col items-end justify-between gap-5">
                  <span className="text-2xl font-black tracking-tighter text-slate-900">
                    $
                    {Number(
                      order.total ?? 0
                    ).toLocaleString(
                      "es-CL"
                    )}
                  </span>

                  <div className="w-full">
                    <label className="mb-1 block text-right text-[9px] font-black uppercase text-slate-400">
                      Estado del envío:
                    </label>

                    <div className="relative">
                      <select
                        value={
                          order.status ??
                          "PENDIENTE"
                        }
                        onChange={(event) =>
                          void updateOrderStatus(
                            order.id,
                            event.target.value
                          )
                        }
                        className={`w-full cursor-pointer appearance-none rounded-2xl border-2 py-4 pl-4 pr-10 text-[11px] font-black transition-all ${
                          order.status ===
                          "ENTREGADO"
                            ? "border-[#97cf00] bg-[#97cf00] text-white"
                            : "border-slate-900 bg-slate-900 text-white"
                        }`}
                      >
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

                      <ChevronRight
                        size={14}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-white/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col gap-4 rounded-[2rem] border-2 border-slate-50 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-[9px] font-black uppercase text-slate-400 sm:ml-6 sm:text-left">
            Página {currentPage} de{" "}
            {totalPages}
          </p>

          <div className="flex justify-center gap-2">
            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page - 1
                )
              }
              className="rounded-2xl border-2 border-slate-100 bg-white px-6 py-3 text-[10px] font-black uppercase hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Anterior
            </button>

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) => page + 1
                )
              }
              className="rounded-2xl bg-slate-900 px-6 py-3 text-[10px] font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManager;