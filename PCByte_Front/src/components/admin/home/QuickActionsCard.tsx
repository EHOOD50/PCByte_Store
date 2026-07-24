import type { ReactNode } from "react";

import {
  Boxes,
  FolderTree,
  PackagePlus,
  ShoppingCart,
  Tags,
  Truck,
} from "lucide-react";

interface QuickAction {
  title: string;
  subtitle: string;
  icon: ReactNode;
  color: string;
}

const actions: QuickAction[] = [
  {
    title: "Nuevo producto",
    subtitle: "Agregar al catálogo",
    icon: <PackagePlus size={22} />,
    color: "bg-[#0066FF]",
  },
  {
    title: "Nuevo despacho",
    subtitle: "Gestionar logística",
    icon: <Truck size={22} />,
    color: "bg-[#97cf00]",
  },
  {
    title: "Ver pedidos",
    subtitle: "Administrar ventas",
    icon: <ShoppingCart size={22} />,
    color: "bg-violet-600",
  },
  {
    title: "Categorías",
    subtitle: "Organizar catálogo",
    icon: <FolderTree size={22} />,
    color: "bg-orange-500",
  },
  {
    title: "Marcas",
    subtitle: "Administrar marcas",
    icon: <Tags size={22} />,
    color: "bg-cyan-600",
  },
  {
    title: "Inventario",
    subtitle: "Gestionar stock",
    icon: <Boxes size={22} />,
    color: "bg-emerald-600",
  },
];

const QuickActionsCard = () => {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
          Acciones rápidas
        </p>

        <h3 className="mt-1 text-xl font-black text-slate-900">
          Accesos frecuentes
        </h3>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.title}
            className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-1 hover:border-[#0066FF]/30 hover:bg-white hover:shadow-lg"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${action.color}`}
            >
              {action.icon}
            </div>

            <h4 className="mt-4 text-sm font-black text-slate-900 transition group-hover:text-[#0066FF]">
              {action.title}
            </h4>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              {action.subtitle}
            </p>
          </button>
        ))}
      </div>
    </article>
  );
};

export default QuickActionsCard;