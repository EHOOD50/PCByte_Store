import React from "react";
import { X } from "lucide-react";

interface CategoryFormData {
  id: number | null;
  name: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  formData: CategoryFormData;
  onClose: () => void;
  onChange: React.Dispatch<
    React.SetStateAction<CategoryFormData>
  >;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  formData,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[2.5rem] border-b-8 border-[#97cf00] bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b bg-slate-50 p-8">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">
            {formData.id
              ? "Actualizar Categoría"
              : "Nueva Categoría"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white p-2 text-red-500 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-6 p-8"
        >
          <div>
            <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
              Nombre
            </label>

            <input
              type="text"
              required
              autoFocus
              value={formData.name}
              onChange={(event) =>
                onChange({
                  ...formData,
                  name: event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl border-2 border-transparent bg-slate-50 p-4 text-sm font-bold outline-none transition-all focus:border-[#0066FF]"
              placeholder="Ej: Monitores"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 py-5 text-xs font-black uppercase tracking-widest text-[#97cf00] transition-all hover:bg-[#0066FF] hover:text-white"
          >
            {formData.id
              ? "Actualizar categoría"
              : "Crear categoría"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;