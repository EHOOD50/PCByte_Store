import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "../../../types/types";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({
  categories,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              ID
            </th>

            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Nombre
            </th>

            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="py-10 text-center text-sm font-semibold text-slate-400"
              >
                No existen categorías.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr
                key={category.id}
                className="border-b transition hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-black text-slate-500">
                  {category.id}
                </td>

                <td className="px-6 py-4 font-bold text-slate-800">
                  {category.name}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(category)}
                      className="rounded-xl bg-[#0066FF]/10 p-3 text-[#0066FF] transition hover:bg-[#0066FF] hover:text-white"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(category)}
                      className="rounded-xl bg-red-100 p-3 text-red-600 transition hover:bg-red-600 hover:text-white"
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