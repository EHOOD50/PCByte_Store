import React from "react";
import { X } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface ProductFormData {
  id: number | null;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  brandId: number | null;
  imageUrl: string;
}

interface ProductModalProps {
  isOpen: boolean;
  formData: ProductFormData;
  categories: any[];
  brands: any[];
  onClose: () => void;
  onChange: React.Dispatch<React.SetStateAction<ProductFormData>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  formData,
  categories,
  brands,
  onClose,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] border-b-8 border-[#97cf00] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-slate-50 p-8">
          <h3 className="text-xl font-black uppercase italic tracking-tighter">
            {formData.id ? "Actualizar Producto" : "Nuevo Producto"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white p-2 text-red-500 shadow-sm"
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 p-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
                Modelo / Nombre
              </label>

              <input
                type="text"
                value={formData.name}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    name: event.target.value,
                  })
                }
                className="w-full rounded-2xl border-2 border-transparent bg-slate-50 p-4 text-sm font-bold outline-none transition-all focus:border-[#0066FF]"
                placeholder="Ej: NVIDIA RTX 4090"
                required
              />
            </div>

            <div>
              <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
                Categoría
              </label>

              <select
                value={formData.categoryId}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    categoryId: Number(event.target.value),
                  })
                }
                className="w-full cursor-pointer appearance-none rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none"
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
                Marca
              </label>

              <select
                value={formData.brandId ?? ""}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    brandId: event.target.value
                      ? Number(event.target.value)
                      : null,
                  })
                }
                className="w-full cursor-pointer appearance-none rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none"
              >
                <option value="">Sin marca</option>

                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
                Descripción
              </label>

              <textarea
                value={formData.description}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    description: event.target.value,
                  })
                }
                className="min-h-[100px] w-full resize-none rounded-2xl bg-slate-50 p-4 text-sm font-bold outline-none"
              />
            </div>

            <div>
              <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
                Precio ($)
              </label>

              <input
                type="number"
                min="1"
                value={formData.price}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    price: Number(event.target.value),
                  })
                }
                className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black"
                required
              />
            </div>

            <div>
              <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    stock: Number(event.target.value),
                  })
                }
                className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-black"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="ml-1 block text-[9px] font-black uppercase text-slate-400">
                Imagen URL
              </label>

              <input
                type="text"
                value={formData.imageUrl}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    imageUrl: event.target.value,
                  })
                }
                className="w-full rounded-2xl bg-slate-50 p-4 text-sm font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-900 py-5 text-xs font-black uppercase tracking-widest text-[#97cf00] transition-all hover:bg-[#0066FF] hover:text-white"
          >
            {formData.id ? "Actualizar producto" : "Crear producto"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;