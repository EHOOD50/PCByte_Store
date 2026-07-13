import React from "react";
import type { Product } from "../../../types/types";
import { Edit3, Trash2 } from "lucide-react";

interface ProductTableProps {
  products: any[];
  onEdit: (product: any) => void;
  onDelete: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-10 text-center">
        <p className="text-sm font-bold text-slate-500">
          No hay productos disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2.5rem] border-2 border-slate-100 bg-white shadow-sm">
      <table className="w-full text-left">
        <thead className="border-b bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <tr>
            <th className="p-6">Producto</th>
            <th className="p-6">Categoría</th>
            <th className="p-6">Marca</th>
            <th className="p-6">Stock</th>
            <th className="p-6">Precio</th>
            <th className="p-6 text-right">Gestión</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {products.map((product) => (
            <tr
              key={product.id}
              className="transition-colors hover:bg-slate-50/50"
            >
              <td className="flex items-center gap-4 p-6">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-12 w-12 rounded-xl bg-slate-100 object-cover"
                />

                <div>
                  <p className="text-xs font-black uppercase">
                    {product.name}
                  </p>

                  <p className="text-[9px] font-bold uppercase text-slate-400">
                    REF: {product.id}
                  </p>
                </div>
              </td>

              <td className="p-6 text-[10px] font-black uppercase text-slate-500">
                {product.categoryName ?? product.category?.name ?? "Sin categoría"}
              </td>

              <td className="p-6 text-[10px] font-black uppercase text-slate-500">
                {product.brandName ?? product.brand?.name ?? "Sin marca"}
              </td>

              <td className="p-6 text-xs font-black">
                {product.stock}
              </td>

              <td className="p-6 text-xs font-black text-[#0066FF]">
                ${Number(product.price).toLocaleString("es-CL")}
              </td>

              <td className="p-6 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(product)}
                  className="p-2 text-slate-400 transition-colors hover:text-blue-500"
                  aria-label={`Editar ${product.name}`}
                >
                  <Edit3 size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  className="p-2 text-slate-400 transition-colors hover:text-red-500"
                  aria-label={`Eliminar ${product.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;