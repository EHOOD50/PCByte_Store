import type {
  ReactNode,
} from "react";

import {
  Boxes,
  FolderTree,
  PackagePlus,
  ShoppingCart,
  Tags,
  Truck,
} from "lucide-react";

export type QuickActionId =
  | "new-product"
  | "new-shipment"
  | "view-orders"
  | "categories"
  | "brands"
  | "inventory";

interface QuickActionsCardProps {
  onAction: (
    action: QuickActionId
  ) => void;
}

interface QuickAction {
  id: QuickActionId;
  title: string;
  subtitle: string;
  icon: ReactNode;
  color: string;
}

const actions: QuickAction[] = [
  {
    id: "new-product",
    title: "Nuevo producto",
    subtitle: "Agregar al catálogo",
    icon: (
      <PackagePlus size={18} />
    ),
    color: "bg-[#0066FF]",
  },
  {
    id: "new-shipment",
    title: "Nuevo despacho",
    subtitle: "Gestionar logística",
    icon: (
      <Truck size={18} />
    ),
    color:
      "bg-[#97cf00] text-[#08101d]",
  },
  {
    id: "view-orders",
    title: "Ver pedidos",
    subtitle: "Administrar ventas",
    icon: (
      <ShoppingCart size={18} />
    ),
    color: "bg-violet-600",
  },
  {
    id: "categories",
    title: "Categorías",
    subtitle: "Organizar catálogo",
    icon: (
      <FolderTree size={18} />
    ),
    color: "bg-orange-500",
  },
  {
    id: "brands",
    title: "Marcas",
    subtitle: "Administrar marcas",
    icon: (
      <Tags size={18} />
    ),
    color: "bg-cyan-600",
  },
  {
    id: "inventory",
    title: "Inventario",
    subtitle: "Gestionar stock",
    icon: (
      <Boxes size={18} />
    ),
    color: "bg-emerald-600",
  },
];

const QuickActionsCard = ({
  onAction,
}: QuickActionsCardProps) => {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Acciones rápidas
          </p>

          <h3 className="mt-1 text-lg font-black text-slate-900">
            Accesos frecuentes
          </h3>
        </div>

        <p className="hidden text-[11px] font-medium text-slate-400 xl:block">
          Atajos de administración
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {actions.map(
          (action) => (
            <button
              key={action.id}
              type="button"
              onClick={() =>
                onAction(
                  action.id
                )
              }
              className="group flex min-h-[92px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left transition hover:-translate-y-0.5 hover:border-[#0066FF]/30 hover:bg-white hover:shadow-md xl:flex-col xl:items-start"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${action.color}`}
              >
                {action.icon}
              </div>

              <div className="min-w-0">
                <h4 className="truncate text-[13px] font-black leading-5 text-slate-900 transition group-hover:text-[#0066FF]">
                  {action.title}
                </h4>

                <p className="mt-0.5 line-clamp-1 text-[10px] leading-4 text-slate-500">
                  {action.subtitle}
                </p>
              </div>
            </button>
          )
        )}
      </div>
    </article>
  );
};

export default QuickActionsCard;