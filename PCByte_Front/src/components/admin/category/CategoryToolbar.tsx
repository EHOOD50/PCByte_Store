import { Plus } from "lucide-react";

interface CategoryToolbarProps {
  onNewCategory: () => void;
}

export default function CategoryToolbar({
  onNewCategory,
}: CategoryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
          Administración
        </p>

        <h2 className="mt-1 text-2xl font-black uppercase italic tracking-tight text-slate-900">
          Categorías
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Organiza los productos del catálogo.
        </p>
      </div>

      <button
        type="button"
        onClick={onNewCategory}
        className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-[#97cf00] transition hover:bg-[#0066FF] hover:text-white"
      >
        <Plus size={18} />
        Nueva categoría
      </button>
    </div>
  );
}