import React, { useEffect, useMemo, useState } from "react";
import {
  Cpu,
  Layout,
  LogOut,
} from "lucide-react";

import ProductManager from "./admin/ProductManager";
import CategoryManager from "./admin/CategoryManager";
import BrandManager from "./admin/BrandManager";
import OrdersManager from "./admin/OrdersManager";
import MenuBuilder from "./admin/MenuBuilder";

import type { MenuGroup } from "./admin/MenuBuilder";

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

interface Category {
  id: number;
  name: string;
}

interface ProductSummary {
  id: number;
  categoryName?: string;
  category?: {
    id?: number;
    name?: string;
  };
}

const DEFAULT_MENU_GROUPS: MenuGroup[] = [
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

const AdminDashboard: React.FC<
  AdminDashboardProps
> = ({ onLogout }) => {
  const [activeTab, setActiveTab] =
    useState<AdminTab>("products");

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [products, setProducts] =
    useState<ProductSummary[]>([]);

  const [menuGroups, setMenuGroups] =
    useState<MenuGroup[]>(DEFAULT_MENU_GROUPS);

  const [loading, setLoading] =
    useState(true);

  const [notification, setNotification] =
    useState<string | null>(null);

  const showNotification = (
    message: string
  ) => {
    setNotification(message);

    window.setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const loadLocalMenuConfiguration =
    (): MenuGroup[] => {
      const savedConfiguration =
        localStorage.getItem(
          "pcbyte_menu_config"
        );

      if (!savedConfiguration) {
        return DEFAULT_MENU_GROUPS;
      }

      try {
        const parsedConfiguration =
          JSON.parse(savedConfiguration);

        return Array.isArray(
          parsedConfiguration
        )
          ? parsedConfiguration
          : DEFAULT_MENU_GROUPS;
      } catch (error) {
        console.error(
          "Configuración local del menú inválida:",
          error
        );

        return DEFAULT_MENU_GROUPS;
      }
    };

  const fetchDashboardData =
    async () => {
      setLoading(true);

      try {
        const [
          categoriesResponse,
          productsResponse,
          menuConfigResponse,
        ] = await Promise.all([
          adminApi
            .get("/categories")
            .catch(() => ({
              data: [],
            })),

          adminApi
            .get("/products?size=1000")
            .catch(() => ({
              data: [],
            })),

          adminApi
            .get("/config/menu")
            .catch(() => null),
        ]);

        const categoriesContent =
          categoriesResponse.data
            ?._embedded?.categories ??
          categoriesResponse.data
            ?.content ??
          categoriesResponse.data ??
          [];

        setCategories(
          Array.isArray(
            categoriesContent
          )
            ? categoriesContent
            : []
        );

        const productsContent =
          productsResponse.data
            ?._embedded?.products ??
          productsResponse.data
            ?.content ??
          productsResponse.data ??
          [];

        setProducts(
          Array.isArray(productsContent)
            ? productsContent
            : []
        );

        const backendConfigValue =
          menuConfigResponse?.data
            ?.configValue;

        if (backendConfigValue) {
          try {
            const parsedConfig =
              JSON.parse(
                backendConfigValue
              );

            if (
              Array.isArray(
                parsedConfig
              )
            ) {
              setMenuGroups(
                parsedConfig
              );

              localStorage.setItem(
                "pcbyte_menu_config",
                JSON.stringify(
                  parsedConfig
                )
              );

              return;
            }
          } catch (error) {
            console.error(
              "Configuración del menú inválida:",
              error
            );
          }
        }

        setMenuGroups(
          loadLocalMenuConfiguration()
        );
      } catch (error) {
        console.error(
          "Error al cargar el panel administrativo:",
          error
        );

        setMenuGroups(
          loadLocalMenuConfiguration()
        );

        showNotification(
          "Error al sincronizar el panel"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  const categoryProductCounts =
    useMemo<Record<string, number>>(
      () => {
        return products.reduce<
          Record<string, number>
        >((counts, product) => {
          const categoryName =
            product.categoryName ??
            product.category?.name;

          if (!categoryName) {
            return counts;
          }

          const normalizedName =
            categoryName
              .trim()
              .toUpperCase();

          counts[normalizedName] =
            (counts[normalizedName] ??
              0) + 1;

          return counts;
        }, {});
      },
      [products]
    );

  const saveMenuConfig = async (
    config: MenuGroup[]
  ): Promise<void> => {
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

      showNotification(
        "Interfaz sincronizada"
      );
    } catch (error) {
      console.error(
        "Error al guardar la configuración del menú:",
        error
      );

      showNotification(
        "No se pudo guardar el menú"
      );

      throw error;
    }
  };

  const changeTab = (
    tab: AdminTab
  ) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <Cpu
          size={48}
          className="mb-4 animate-spin text-[#97cf00]"
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
                activeTab ===
                "products"
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
              onClick={() =>
                changeTab("brands")
              }
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
          title="Cerrar sesión"
        >
          <LogOut size={16} />

          <span className="hidden sm:inline">
            Salir
          </span>
        </button>
      </nav>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">
        {activeTab ===
          "products" && (
          <ProductManager
            onManageCategories={() =>
              changeTab(
                "categories"
              )
            }
          />
        )}

        {activeTab ===
          "categories" && (
          <CategoryManager />
        )}

        {activeTab ===
          "brands" && (
          <BrandManager />
        )}

        {activeTab ===
          "orders" && (
          <OrdersManager />
        )}

        {activeTab ===
          "menu-builder" && (
          <MenuBuilder
            menuGroups={menuGroups}
            categories={categories}
            categoryProductCounts={
              categoryProductCounts
            }
            onSave={saveMenuConfig}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;