import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Brand } from "../../../types/types";

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export default function BrandTable({
  brands,
  onEdit,
  onDelete,
}: BrandTableProps) {
  return (
    <div className="overflow-x-auto rounded-[2rem] border border-slate-100 bg-white shadow-sm">
      <table className="min-w-[780px] w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Logo
            </th>

            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Marca
            </th>

            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Sitio web
            </th>

            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Estado
            </th>

            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {brands.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-sm font-semibold text-slate-400"
              >
                No existen marcas registradas.
              </td>
            </tr>
          ) : (
            brands.map((brand) => (
              <tr
                key={brand.id}
                className="border-b transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {brand.logoUrl ? (
                      <img
                        src={brand.logoUrl}
                        alt={`Logo de ${brand.name}`}
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-[8px] font-black uppercase text-slate-400">
                        Sin logo
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <p className="font-black uppercase text-slate-800">
                    {brand.name}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase text-slate-400">
                    ID: {brand.id}
                  </p>
                </td>

                <td className="px-6 py-4">
                  {brand.website ? (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#0066FF] hover:underline"
                    >
                      {brand.website}
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-slate-400">
                      Sin sitio web
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-black uppercase ${
                      brand.active ?? true
                        ? "bg-[#97cf00]/15 text-[#6b9500]"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {brand.active ?? true ? "Activa" : "Inactiva"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(brand)}
                      className="rounded-xl bg-[#0066FF]/10 p-3 text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white"
                      aria-label={`Editar ${brand.name}`}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(brand)}
                      className="rounded-xl bg-red-100 p-3 text-red-600 transition hover:bg-red-600 hover:text-white"
                      aria-label={`Eliminar ${brand.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}