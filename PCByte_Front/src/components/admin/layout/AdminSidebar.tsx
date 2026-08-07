import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  FolderTree,
  House,
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
  | "users"
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
    title: "General",
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
    title: "Operación",
    items: [
      {
  id: "orders",
  label: "Pedidos y despachos",
  icon: <ShoppingCart size={18} />,
},
{
  id: "shipping",
  label: "Tarifas de despacho",
  icon: <Truck size={18} />,
},
    ],
  },
  {
    title: "Diseño",
    items: [
      {
        id: "menu-builder",
        label: "Diseño del sitio",
        icon: <Menu size={18} />,
      },
    ],
  },
  {
    title: "Configuración",
    items: [
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
        <header
          className={`flex min-h-[112px] items-center border-b border-white/10 ${
            collapsed
              ? "justify-center px-3"
              : "justify-between gap-3 px-4"
          }`}
        >
          <div
            className={`flex min-w-0 items-center ${
              collapsed
                ? "justify-center"
                : "flex-1"
            }`}
          >
            <div
              className={`flex shrink-0 items-center justify-center overflow-hidden ${
                collapsed
                  ? "h-14 w-14"
                  : "h-[84px] w-[180px]"
              }`}
            >
              <img
                src={logo}
                alt="PCByte"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {!collapsed && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  onToggleCollapsed
                }
                aria-label="Contraer menú"
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white lg:flex"
              >
                <ChevronLeft
                  size={18}
                />
              </button>

              <button
                type="button"
                onClick={
                  onCloseMobile
                }
                aria-label="Cerrar menú"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </header>

        {collapsed && (
          <div className="hidden border-b border-white/10 px-3 py-3 lg:block">
            <button
              type="button"
              onClick={
                onToggleCollapsed
              }
              aria-label="Expandir menú"
              title="Expandir menú"
              className="flex h-10 w-full items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <ChevronRight
                size={18}
              />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <nav className="space-y-5">
            {navigationGroups.map(
              (group) => (
                <section
                  key={group.title}
                >
                  {!collapsed && (
                    <p className="mb-2 px-3 text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">
                      {group.title}
                    </p>
                  )}

                  {collapsed && (
                    <div className="mx-auto mb-2 h-px w-8 bg-white/10 first:hidden" />
                  )}

                  <div className="space-y-1">
                    {group.items.map(
                      (item) => {
                        const active =
                          activeTab ===
                          item.id;

                        return (
                          <button
                            key={
                              item.id
                            }
                            type="button"
                            disabled={
                              item.disabled
                            }
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
                                ? "bg-[#0066FF] text-white shadow-[0_10px_28px_rgba(0,102,255,0.26)]"
                                : item.disabled
                                  ? "cursor-not-allowed text-slate-700"
                                  : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                            }`}
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                                active
                                  ? "bg-white/15 text-white"
                                  : item.disabled
                                    ? "bg-white/[0.03] text-slate-700"
                                    : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-[#97cf00]"
                              }`}
                            >
                              {
                                item.icon
                              }
                            </span>

                            {!collapsed && (
                              <>
                                <span className="flex-1 text-[11px] font-black uppercase tracking-wide">
                                  {
                                    item.label
                                  }
                                </span>

                                {item.disabled && (
                                  <span className="rounded-full border border-white/10 px-2 py-1 text-[7px] font-black uppercase tracking-wider text-slate-600">
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

        <footer
          className={`border-t border-white/10 ${
            collapsed
              ? "px-3 py-4"
              : "px-5 py-4"
          }`}
        >
          {collapsed ? (
            <div
              title="Sistema PCByte"
              className="flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]" />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-600">
                  Estado del sistema
                </p>

                <div className="mt-1.5 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.65)]" />

                  <span className="text-[9px] font-bold text-slate-400">
                    Operación normal
                  </span>
                </div>
              </div>

              <span className="text-[8px] font-black uppercase tracking-wider text-slate-700">
                v1.0
              </span>
            </div>
          )}
        </footer>
      </aside>
    </>
  );
};

export default AdminSidebar;