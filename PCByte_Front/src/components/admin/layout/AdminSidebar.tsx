import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  UsersRound,
  X,
} from "lucide-react";

import logo from "../../../assets/logo.png";

import type {
  ReactNode,
} from "react";

export type AdminTab =
  | "home"
  | "products"
  | "categories"
  | "brands"
  | "orders"
  | "shipping"
  | "customers"
  | "menu-builder"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab;

  collapsed: boolean;
  mobileOpen: boolean;

  onChangeTab: (
    tab: AdminTab
  ) => void;

  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
  onLogout: () => void;
}

interface NavigationItem {
  id: AdminTab;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
}

const navigationGroups: NavigationGroup[] = [
  {
    title: "Inicio",
    items: [
      {
        id: "home",
        label: "Dashboard",
        icon: <House size={18} />,
      },
    ],
  },
  {
    title: "Catálogo",
    items: [
      {
        id: "products",
        label: "Productos",
        icon: <Boxes size={18} />,
      },
      {
        id: "categories",
        label: "Categorías",
        icon: <FolderTree size={18} />,
      },
      {
        id: "brands",
        label: "Marcas",
        icon: <Tags size={18} />,
      },
    ],
  },
  {
    title: "Ventas",
    items: [
      {
        id: "orders",
        label: "Pedidos",
        icon: <ShoppingCart size={18} />,
      },
      {
        id: "shipping",
        label: "Logística",
        icon: <Truck size={18} />,
      },
      {
        id: "customers",
        label: "Clientes",
        icon: <UsersRound size={18} />,
        disabled: true,
      },
    ],
  },
  {
    title: "Sistema",
    items: [
      {
        id: "menu-builder",
        label: "Menú del sitio",
        icon: <Menu size={18} />,
      },
      {
        id: "settings",
        label: "Configuración",
        icon: <Settings size={18} />,
        disabled: true,
      },
    ],
  },
];

const AdminSidebar = ({
  activeTab,
  collapsed,
  mobileOpen,
  onChangeTab,
  onToggleCollapsed,
  onCloseMobile,
  onLogout,
}: AdminSidebarProps) => {
  const handleChangeTab = (
    tab: AdminTab,
    disabled?: boolean
  ) => {
    if (disabled) {
      return;
    }

    onChangeTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Cerrar menú administrativo"
          onClick={onCloseMobile}
          className="fixed inset-0 z-[80] bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-[90] flex flex-col border-r border-white/10 bg-[#08101d] text-white shadow-2xl transition-all duration-300 ${
          collapsed
            ? "w-[92px]"
            : "w-[280px]"
        } ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className={`flex min-h-[112px] items-center border-b border-white/10 ${
            collapsed
              ? "justify-center px-3"
              : "justify-between gap-3 px-5"
          }`}
        >
          <div
            className={`flex min-w-0 items-center ${
              collapsed
                ? "justify-center"
                : "gap-3"
            }`}
          >
            <div
              className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#97cf00]/25 bg-black/35 ${
                collapsed
                  ? "h-14 w-14 p-1.5"
                  : "h-16 w-28 p-1.5"
              }`}
            >
              <img
                src={logo}
                alt="PCByte"
                className="h-full w-full object-contain"
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#97cf00]">
                  Administración
                </p>

                <h1 className="mt-1 truncate text-lg font-black tracking-tight text-white">
                  Panel PCByte
                </h1>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <div className="mb-5 flex w-full items-center gap-3 rounded-2xl border border-[#0066FF]/25 bg-[#0066FF]/10 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF] text-white">
                <LayoutDashboard size={17} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-[#80afff]">
                  Centro de operaciones
                </p>

                <p className="mt-1 text-xs font-black text-white">
                  Gestión de la tienda
                </p>
              </div>
            </div>
          )}

          <nav className="space-y-6">
            {navigationGroups.map(
              (group) => (
                <section key={group.title}>
                  {!collapsed && (
                    <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                      {group.title}
                    </p>
                  )}

                  <div className="space-y-1">
                    {group.items.map(
                      (item) => {
                        const active =
                          activeTab === item.id;

                        return (
                          <button
                            key={item.id}
                            type="button"
                            disabled={item.disabled}
                            onClick={() =>
                              handleChangeTab(
                                item.id,
                                item.disabled
                              )
                            }
                            title={
                              collapsed
                                ? item.label
                                : undefined
                            }
                            className={`group relative flex min-h-[46px] w-full items-center rounded-xl text-left transition ${
                              collapsed
                                ? "justify-center px-2"
                                : "gap-3 px-3"
                            } ${
                              active
                                ? "bg-[#0066FF] text-white shadow-[0_10px_28px_rgba(0,102,255,0.28)]"
                                : item.disabled
                                  ? "cursor-not-allowed text-slate-600"
                                  : "text-slate-400 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                                active
                                  ? "bg-white/15 text-white"
                                  : "bg-white/5 text-slate-400 group-hover:text-[#97cf00]"
                              }`}
                            >
                              {item.icon}
                            </span>

                            {!collapsed && (
                              <>
                                <span className="flex-1 text-xs font-black uppercase tracking-wide">
                                  {item.label}
                                </span>

                                {item.disabled && (
                                  <span className="rounded-full border border-white/10 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-slate-600">
                                    Próximamente
                                  </span>
                                )}
                              </>
                            )}

                            {active && (
                              <span className="absolute right-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-l-full bg-[#97cf00]" />
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </section>
              )
            )}
          </nav>
        </div>

        <div className="border-t border-white/10 p-3">
          {!collapsed && (
            <div className="mb-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#97cf00] text-sm font-black text-[#08101d]">
                  EH
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-black text-white">
                    Esteban Hood
                  </p>

                  <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                    Administrador
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onLogout}
            title={
              collapsed
                ? "Cerrar sesión"
                : undefined
            }
            className={`flex min-h-[46px] w-full items-center rounded-xl border border-red-500/15 bg-red-500/5 text-red-400 transition hover:border-red-500/30 hover:bg-red-500 hover:text-white ${
              collapsed
                ? "justify-center px-2"
                : "gap-3 px-4"
            }`}
          >
            <LogOut size={18} />

            {!collapsed && (
              <span className="text-xs font-black uppercase tracking-wide">
                Cerrar sesión
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleCollapsed}
            className="mt-3 hidden min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-white/10 text-slate-500 transition hover:bg-white/10 hover:text-white lg:flex"
            aria-label={
              collapsed
                ? "Expandir menú"
                : "Contraer menú"
            }
          >
            {collapsed ? (
              <ChevronRight size={17} />
            ) : (
              <>
                <ChevronLeft size={17} />

                <span className="text-[9px] font-black uppercase tracking-wider">
                  Contraer menú
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;