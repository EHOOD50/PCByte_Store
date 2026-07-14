import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  Cpu,
  Edit3,
  Layout,
  LogOut,
  MapPin,
  Save,
  X,
} from "lucide-react";

import ProductManager from "./admin/ProductManager";
import CategoryManager from "./admin/CategoryManager";
import BrandManager from "./admin/BrandManager";
import adminApi from "../api/adminApi";

interface AdminDashboardProps {
  onLogout: () => void;
}

type AdminTab =
  | "products"
  | "categories"
  | "brands"
  | "orders"
  | "menu-builder";

interface MenuGroup {
  id: number;
  title: string;
  color: string;
  cats: string[];
}

interface Category {
  id: number;
  name: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
}) => {
  const [activeTab, setActiveTab] =
    useState<AdminTab>("products");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [orders, setOrders] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [notification, setNotification] =
    useState<string | null>(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [searchTerm] = useState("");
  const [filterStatus] = useState("ALL");

  const [editingGroupId, setEditingGroupId] =
    useState<number | null>(null);

  const itemsPerPage = 10;

  const [menuGroups, setMenuGroups] =
    useState<MenuGroup[]>(() => {
      const saved = localStorage.getItem(
        "pcbyte_menu_config"
      );

      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              title: "COMPONENTES",
              color: "#0066FF",
              cats: [],
            },
            {
              id: 2,
              title: "AUDIO & STREAMING",
              color: "#97cf00",
              cats: [],
            },
          ];
    });

  const showToast = (message: string) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const [
        categoriesResponse,
        configResponse,
        ordersResponse,
      ] = await Promise.all([
        adminApi
          .get("/categories")
          .catch(() => ({ data: [] })),

        adminApi
          .get("/config/menu")
          .catch(() => null),

        adminApi
          .get("/admin/orders")
          .catch(() => ({ data: [] })),
      ]);

      const categoriesContent =
        categoriesResponse.data?._embedded
          ?.categories ??
        categoriesResponse.data?.content ??
        categoriesResponse.data ??
        [];

      setCategories(
        Array.isArray(categoriesContent)
          ? categoriesContent
          : []
      );

      if (
        configResponse?.data?.configValue
      ) {
        setMenuGroups(
          JSON.parse(
            configResponse.data.configValue
          )
        );
      }

      const ordersContent =
        ordersResponse.data?._embedded?.orders ??
        ordersResponse.data?.content ??
        ordersResponse.data ??
        [];

      setOrders(
        Array.isArray(ordersContent)
          ? ordersContent
          : []
      );
    } catch (error) {
      console.error(
        "Error al sincronizar el panel:",
        error
      );

      showToast("Error de sincronización");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    filterStatus,
    activeTab,
  ]);

  const filteredOrders = orders
    .filter((order: any) => {
      const term =
        searchTerm.toLowerCase();

      return (
        order.id
          ?.toString()
          .includes(term) ||
        (
          order.customerEmail ?? ""
        )
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
      (order: any) =>
        filterStatus === "ALL" ||
        order.status === filterStatus
    );

  const currentOrders =
    filteredOrders.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage * itemsPerPage
    );

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrders.length /
        itemsPerPage
    )
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

      showToast("Estado actualizado");
      await fetchData();
    } catch (error) {
      console.error(
        "Error al actualizar pedido:",
        error
      );

      showToast(
        "Error al cambiar el estado"
      );
    }
  };

  const saveMenuConfig = async (
    config: MenuGroup[]
  ) => {
    setMenuGroups(config);

    try {
      await adminApi.post(
        "/config/menu",
        {
          configKey: "MAIN_MENU",
          configValue:
            JSON.stringify(config),
        }
      );

      localStorage.setItem(
        "pcbyte_menu_config",
        JSON.stringify(config)
      );

      showToast("Interfaz sincronizada");
    } catch (error) {
      console.error(
        "Error al guardar menú:",
        error
      );

      showToast(
        "Error al guardar el menú"
      );
    }
  };

  const addCategoryToGroup = (
    groupId: number,
    categoryName: string
  ) => {
    const updatedGroups =
      menuGroups.map((group) => {
        if (
          group.id === groupId &&
          !group.cats.includes(
            categoryName
          )
        ) {
          return {
            ...group,
            cats: [
              ...group.cats,
              categoryName,
            ],
          };
        }

        return group;
      });

    void saveMenuConfig(
      updatedGroups
    );
  };

  const removeCategoryFromGroup = (
    groupId: number,
    categoryName: string
  ) => {
    const updatedGroups =
      menuGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              cats: group.cats.filter(
                (category) =>
                  category !==
                  categoryName
              ),
            }
          : group
      );

    void saveMenuConfig(
      updatedGroups
    );
  };

  const changeTab = (
    tab: AdminTab
  ) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <Cpu
          className="mb-4 animate-spin text-[#97cf00]"
          size={48}
        />

        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Accediendo al Core...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {notification && (
        <div className="fixed right-4 top-24 z-[200] rounded-2xl border-b-4 border-[#97cf00] bg-slate-900 px-6 py-3 text-xs font-black uppercase text-[#97cf00] shadow-2xl animate-in slide-in-from-right">
          {notification}
        </div>
      )}

      <nav className="sticky top-0 z-50 flex min-h-20 items-center justify-between gap-4 border-b-2 border-[#97cf00] bg-slate-900 px-4 py-3 shadow-xl sm:px-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-8">
          <h1 className="shrink-0 text-2xl font-black uppercase italic tracking-tighter text-white">
            PC
            <span className="text-[#0066FF]">
              BYTE
            </span>

            <span className="ml-2 rounded-md border border-[#97cf00]/20 bg-[#97cf00]/10 px-2 py-1 text-[10px] font-black not-italic text-[#97cf00]">
              Admin
            </span>
          </h1>

          <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-white/5 p-1">
            <button
              type="button"
              onClick={() =>
                changeTab("products")
              }
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-[10px] font-black uppercase transition-all ${
                activeTab === "products"
                  ? "bg-[#0066FF] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Inventario
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab("categories")
              }
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-[10px] font-black uppercase transition-all ${
                activeTab ===
                "categories"
                  ? "bg-[#0066FF] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Categorías
            </button>

              <button
              type="button"
               onClick={() => changeTab("brands")}
                className={`whitespace-nowrap rounded-lg px-4 py-2 text-[10px] font-black uppercase transition-all ${
                 activeTab === "brands"
              ? "bg-[#0066FF] text-white"
               : "text-slate-400 hover:text-white"
              }`}
>
  Marcas
</button>

            <button
              type="button"
              onClick={() =>
                changeTab("orders")
              }
              className={`whitespace-nowrap rounded-lg px-4 py-2 text-[10px] font-black uppercase transition-all ${
                activeTab === "orders"
                  ? "bg-[#0066FF] text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Logística
            </button>

            <button
              type="button"
              onClick={() =>
                changeTab(
                  "menu-builder"
                )
              }
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-[10px] font-black uppercase transition-all ${
                activeTab ===
                "menu-builder"
                  ? "bg-[#97cf00] text-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Layout size={14} />
              Arquitectura
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-[10px] font-black uppercase text-red-500 transition-all hover:bg-red-500 hover:text-white"
          aria-label="Cerrar sesión"
        >
          <LogOut size={16} />
        </button>
      </nav>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">
        {activeTab === "products" && (
          <ProductManager
            onManageCategories={() =>
              changeTab("categories")
            }
          />
        )}

        {activeTab ===
          "categories" && (
          <CategoryManager />
        )}

        {activeTab === "brands" && (
          <BrandManager />
        )}

        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="border-l-4 border-[#0066FF] pl-3 text-xl font-black uppercase italic">
              Logística de Despacho
            </h2>

            <div className="flex flex-col gap-4">
              {currentOrders.map(
                (order: any) => (
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
                                ? "border-[#97cf00] bg-[#97cf00]/10 text-[#97cf00]"
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

                          <span className="text-[11px] font-black text-[#0066FF] underline decoration-2 underline-offset-2">
                            {order.customerEmail ??
                              order.email ??
                              "email_no_disponible@pcbyte.cl"}
                          </span>
                        </div>

                        <div className="rounded-2xl border-l-4 border-slate-900 bg-slate-50 p-5">
                          <div className="flex items-start gap-3">
                            <MapPin
                              size={18}
                              className="mt-1 text-slate-400"
                            />

                            <div className="flex flex-col">
                              <span className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Destino de
                                entrega
                              </span>

                              <span className="text-sm font-black uppercase leading-tight text-slate-800">
                                {order.street}{" "}
                                {order.number}
                                {order.extraInfo
                                  ? ` • ${order.extraInfo}`
                                  : ""}
                                {order.apartment
                                  ? ` • DEPTO ${order.apartment}`
                                  : ""}
                              </span>

                              <span className="mt-1 text-xs font-black uppercase text-[#0066FF]">
                                {order.city},{" "}
                                {order.region}
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
                          {order.orderItems?.map(
                            (
                              item: any,
                              index: number
                            ) => (
                              <div
                                key={index}
                                className="text-[10px] font-black uppercase text-slate-600"
                              >
                                •{" "}
                                {item.quantity}
                                x{" "}
                                {item.productName ??
                                  item.product
                                    ?.name ??
                                  "Producto"}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="flex min-w-[200px] flex-col items-end justify-between gap-5">
                        <span className="text-2xl font-black tracking-tighter text-slate-900">
                          $
                          {order.total?.toLocaleString(
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
                                order.status
                              }
                              onChange={(
                                event
                              ) =>
                                updateOrderStatus(
                                  order.id,
                                  event.target
                                    .value
                                )
                              }
                              className={`w-full cursor-pointer appearance-none rounded-2xl border-2 py-4 pl-4 pr-10 text-[11px] font-black transition-all ${
                                order.status ===
                                "ENTREGADO"
                                  ? "border-[#97cf00] bg-[#97cf00] text-white"
                                  : "border-slate-900 bg-slate-900 text-white"
                              }`}
                            >
                              <option value="PENDIENTE">
                                PENDIENTE
                              </option>

                              <option value="PAGADO">
                                PAGADO
                              </option>

                              <option value="ENVIADO">
                                ENVIADO
                              </option>

                              <option value="ENTREGADO">
                                ENTREGADO
                              </option>
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
                )
              )}
            </div>
          </div>
        )}

        {activeTab ===
          "menu-builder" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="border-l-4 border-[#0066FF] pl-3 text-xl font-black uppercase italic">
                  Arquitectura del Menú
                </h2>

                <p className="mt-1 text-[10px] font-bold uppercase text-slate-400">
                  Haz clic en los
                  títulos para renombrar
                  los grupos
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void saveMenuConfig(
                    menuGroups
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#97cf00] px-6 py-3 text-[10px] font-black uppercase text-black shadow-lg transition-all hover:scale-105"
              >
                <Save size={18} />
                Sincronizar UI
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {menuGroups.map(
                (group) => (
                  <div
                    key={group.id}
                    className="relative overflow-hidden rounded-[3rem] border-2 border-slate-100 bg-white p-8 shadow-sm"
                  >
                    <div className="mb-6 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className="h-8 w-3 shrink-0 rounded-full"
                          style={{
                            backgroundColor:
                              group.color,
                          }}
                        />

                        {editingGroupId ===
                        group.id ? (
                          <input
                            autoFocus
                            value={
                              group.title
                            }
                            onChange={(
                              event
                            ) => {
                              const updatedGroups =
                                menuGroups.map(
                                  (
                                    currentGroup
                                  ) =>
                                    currentGroup.id ===
                                    group.id
                                      ? {
                                          ...currentGroup,
                                          title:
                                            event
                                              .target
                                              .value,
                                        }
                                      : currentGroup
                                );

                              setMenuGroups(
                                updatedGroups
                              );
                            }}
                            onBlur={() =>
                              setEditingGroupId(
                                null
                              )
                            }
                            onKeyDown={(
                              event
                            ) => {
                              if (
                                event.key ===
                                "Enter"
                              ) {
                                setEditingGroupId(
                                  null
                                );
                              }
                            }}
                            className="min-w-0 border-b-2 border-[#0066FF] bg-slate-50 px-2 text-lg font-black uppercase italic tracking-tighter outline-none"
                          />
                        ) : (
                          <h3
                            onClick={() =>
                              setEditingGroupId(
                                group.id
                              )
                            }
                            className="group flex cursor-pointer items-center gap-2 text-lg font-black uppercase italic tracking-tighter hover:text-[#0066FF]"
                          >
                            {group.title}

                            <Edit3
                              size={14}
                              className="text-slate-300 opacity-0 group-hover:opacity-100"
                            />
                          </h3>
                        )}
                      </div>

                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black">
                        {group.cats.length}{" "}
                        CATEGORÍAS
                      </span>
                    </div>

                    <div className="mb-8 flex min-h-[100px] flex-wrap gap-2 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">
                      {group.cats.map(
                        (category) => (
                          <div
                            key={category}
                            className="group flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-4 py-2 shadow-sm"
                          >
                            <span className="text-[10px] font-black uppercase">
                              {category}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                removeCategoryFromGroup(
                                  group.id,
                                  category
                                )
                              }
                              className="text-slate-300 transition-colors hover:text-red-500"
                            >
                              <X
                                size={14}
                              />
                            </button>
                          </div>
                        )
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="ml-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Asignar categoría:
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {categories
                          .filter(
                            (category) =>
                              !group.cats.includes(
                                category.name
                              )
                          )
                          .map(
                            (category) => (
                              <button
                                key={
                                  category.id
                                }
                                type="button"
                                onClick={() =>
                                  addCategoryToGroup(
                                    group.id,
                                    category.name
                                  )
                                }
                                className="rounded-lg bg-slate-100 px-3 py-1.5 text-[9px] font-black uppercase transition-all hover:bg-slate-900 hover:text-white"
                              >
                                +{" "}
                                {
                                  category.name
                                }
                              </button>
                            )
                          )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" &&
          totalPages > 1 && (
            <div className="mt-10 flex items-center justify-between rounded-[2rem] border-2 border-slate-50 bg-white p-4 shadow-sm">
              <p className="ml-6 text-[9px] font-black uppercase text-slate-400">
                Página {currentPage} de{" "}
                {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        page - 1
                    )
                  }
                  className="rounded-2xl border-2 border-slate-100 bg-white px-6 py-3 text-[10px] font-black uppercase hover:bg-slate-50 disabled:opacity-30"
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
                      (page) =>
                        page + 1
                    )
                  }
                  className="rounded-2xl bg-slate-900 px-6 py-3 text-[10px] font-black uppercase text-white disabled:opacity-30"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default AdminDashboard;