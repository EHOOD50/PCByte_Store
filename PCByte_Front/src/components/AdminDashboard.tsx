import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Cpu } from "lucide-react";

import AdminLayout from "./admin/layout/AdminLayout";
import AdminHome from "./admin/home/AdminHome";

import ProductManager from "./admin/ProductManager";
import CategoryManager from "./admin/CategoryManager";
import BrandManager from "./admin/BrandManager";
import OrdersManager from "./admin/OrdersManager";
import ShippingManager from "./admin/ShippingManager";
import MenuBuilder from "./admin/MenuBuilder";

import adminApi from "../api/adminApi";

import type {
  AdminTab,
} from "./admin/layout/AdminSidebar";

import type {
  MenuGroup,
} from "./admin/MenuBuilder";

interface AdminDashboardProps {
  onLogout: () => void;
}

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
> = ({
  onLogout,
}) => {
  const [
    activeTab,
    setActiveTab,
  ] = useState<AdminTab>(
    "home"
  );

  const [
    categories,
    setCategories,
  ] = useState<Category[]>([]);

  const [
    products,
    setProducts,
  ] = useState<ProductSummary[]>(
    []
  );

  const [
    menuGroups,
    setMenuGroups,
  ] = useState<MenuGroup[]>(
    DEFAULT_MENU_GROUPS
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    notification,
    setNotification,
  ] = useState<string | null>(
    null
  );

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
          JSON.parse(
            savedConfiguration
          );

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
            .get(
              "/products?size=1000"
            )
            .catch(() => ({
              data: [],
            })),

          adminApi
            .get("/config/menu")
            .catch(() => null),
        ]);

        const categoriesContent =
          categoriesResponse.data
            ?._embedded
            ?.categories ??
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
            ?._embedded
            ?.products ??
          productsResponse.data
            ?.content ??
          productsResponse.data ??
          [];

        setProducts(
          Array.isArray(
            productsContent
          )
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
        >(
          (
            counts,
            product
          ) => {
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
              (
                counts[
                  normalizedName
                ] ?? 0
              ) + 1;

            return counts;
          },
          {}
        );
      },
      [products]
    );

  const saveMenuConfig =
    async (
      config: MenuGroup[]
    ): Promise<void> => {
      setMenuGroups(config);

      try {
        await adminApi.post(
          "/config/menu",
          {
            configKey:
              "MAIN_MENU",

            configValue:
              JSON.stringify(
                config
              ),
          }
        );

        localStorage.setItem(
          "pcbyte_menu_config",
          JSON.stringify(
            config
          )
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const renderActiveModule =
    () => {
      switch (activeTab) {
        case "home":
          return <AdminHome />;

        case "products":
          return (
            <ProductManager
              onManageCategories={() =>
                changeTab(
                  "categories"
                )
              }
            />
          );

        case "categories":
          return (
            <CategoryManager />
          );

        case "brands":
          return <BrandManager />;

        case "orders":
          return <OrdersManager />;

        case "shipping":
          return <ShippingManager />;

        case "menu-builder":
          return (
            <MenuBuilder
              menuGroups={
                menuGroups
              }
              categories={
                categories
              }
              categoryProductCounts={
                categoryProductCounts
              }
              onSave={
                saveMenuConfig
              }
            />
          );

        case "customers":
        case "settings":
          return (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                Próximamente
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Módulo en desarrollo
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Esta sección está contemplada en la planificación del panel administrativo de PCByte.
              </p>
            </section>
          );

        default:
          return <AdminHome />;
      }
    };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#08101d]">
        <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-[#97cf00]/20 bg-white/5">
          <Cpu
            size={38}
            className="animate-spin text-[#97cf00]"
          />
        </div>

        <span className="mt-5 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
          Accediendo al Core PCByte...
        </span>
      </div>
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onChangeTab={changeTab}
      onLogout={onLogout}
    >
      {notification && (
        <div className="fixed right-4 top-24 z-[200] rounded-2xl border-b-4 border-[#97cf00] bg-slate-900 px-6 py-3 text-xs font-black uppercase text-[#97cf00] shadow-2xl">
          {notification}
        </div>
      )}

      {renderActiveModule()}
    </AdminLayout>
  );
};

export default AdminDashboard;