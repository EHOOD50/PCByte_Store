import React from "react";
import { X } from "lucide-react";

export interface BrandFormData {
  id: number | null;
  name: string;
  logoUrl: string;
  website: string;
  active: boolean;
}

interface BrandModalProps {
  isOpen: boolean;
  formData: BrandFormData;
  onClose: () => void;
  onChange: React.Dispatch<
    React.SetStateAction<BrandFormData>
  >;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  formData,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-[2.5rem] border-b-8 border-[#97cf00] bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b bg-slate-50 p-8">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">
            {formData.id
              ? "Actualizar Marca"
              : "Nueva Marca"}
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
              Nombre *
            </label>

            <input
              required
              autoFocus
              type="text"
              value={formData.name}
              onChange={(event) =>
                onChange({
                  ...formData,
                  name: event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          <div>
            <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
              Sitio Web
            </label>

            <input
              type="text"
              value={formData.website}
              onChange={(event) =>
                onChange({
                  ...formData,
                  website: event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          <div>
            <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
              Logo URL
            </label>

            <input
              type="text"
              value={formData.logoUrl}
              onChange={(event) =>
                onChange({
                  ...formData,
                  logoUrl: event.target.value,
                })
              }
              className="mt-2 w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#0066FF]"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(event) =>
                onChange({
                  ...formData,
                  active: event.target.checked,
                })
              }
            />

            <span className="text-sm font-bold">
              Marca activa
            </span>
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 py-5 text-xs font-black uppercase tracking-widest text-[#97cf00] transition hover:bg-[#0066FF] hover:text-white"
          >
            {formData.id
              ? "Actualizar marca"
              : "Crear marca"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrandModal;