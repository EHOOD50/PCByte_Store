import { FolderCog, Plus } from "lucide-react";

interface ProductToolbarProps {
  onNewProduct: () => void;
  onManageCategories: () => void;
}

export default function ProductToolbar({
  onNewProduct,
  onManageCategories,
}: ProductToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
          Administración
        </p>

        <h2 className="mt-1 text-2xl font-black uppercase italic tracking-tight text-slate-900">
          Gestión de inventario
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Administra productos, stock, categorías y marcas.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onManageCategories}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-700 transition hover:border-[#0066FF] hover:text-[#0066FF]"
        >
          <FolderCog size={18} />
          Gestionar categorías
        </button>

        <button
          type="button"
          onClick={onNewProduct}
          className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-[#97cf00] transition hover:bg-[#0066FF] hover:text-white"
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>
    </div>
  );
}