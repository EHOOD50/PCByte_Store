import React from "react";
import { X } from "lucide-react";

import type {
  Category,
  Brand,
} from "../../../types/types";

export interface ProductFormData {
  id: number | null;
  internalCode: string;
  sku: string;
  mpn: string;
  name: string;
  description: string;
  specifications: string;
  warranty: string;
  price: number;
  stock: number;
  active: boolean;
  categoryId: number;
  brandId: number | null;
  imageUrl: string;
}

interface ProductModalProps {
  isOpen: boolean;
  formData: ProductFormData;
  categories: Category[];
  brands: Brand[];
  onClose: () => void;
  onChange: React.Dispatch<React.SetStateAction<ProductFormData>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const inputClassName =
  "w-full rounded-2xl border-2 border-transparent bg-slate-50 p-4 text-sm font-bold text-slate-800 outline-none transition-all focus:border-[#0066FF]";

const labelClassName =
  "ml-1 block text-[9px] font-black uppercase tracking-wider text-slate-400";

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

  const isEditing = formData.id !== null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2.5rem] border-b-8 border-[#97cf00] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-slate-50 px-8 py-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
              Gestión de inventario
            </p>

            <h3 className="mt-1 text-xl font-black uppercase italic tracking-tighter text-slate-900">
              {isEditing ? "Editar Producto" : "Nuevo Producto"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white p-2 text-red-500 shadow-sm transition hover:bg-red-50"
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="max-h-[calc(92vh-105px)] overflow-y-auto p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClassName}>
                Código interno PCByte
              </label>

              <input
                type="text"
                value={
                  formData.internalCode ||
                  "Se generará automáticamente"
                }
                readOnly
                className={`${inputClassName} cursor-not-allowed bg-slate-100 text-slate-500`}
              />
            </div>

            <div>
              <label className={labelClassName}>
                Estado
              </label>

              <select
                value={formData.active ? "true" : "false"}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    active: event.target.value === "true",
                  })
                }
                className={inputClassName}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>

            <div>
              <label className={labelClassName}>
                SKU
              </label>

              <input
                type="text"
                value={formData.sku}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    sku: event.target.value,
                  })
                }
                className={inputClassName}
                placeholder="Código comercial del producto"
                maxLength={100}
              />
            </div>

            <div>
              <label className={labelClassName}>
                MPN
              </label>

              <input
                type="text"
                value={formData.mpn}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    mpn: event.target.value,
                  })
                }
                className={inputClassName}
                placeholder="Número de parte del fabricante"
                maxLength={100}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
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
                className={inputClassName}
                placeholder="Ej: Notebook Lenovo IdeaPad 3"
                maxLength={255}
                required
              />
            </div>

            <div>
              <label className={labelClassName}>
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
                className={inputClassName}
                required
              >
                {categories.length === 0 && (
                  <option value={0}>
                    No hay categorías disponibles
                  </option>
                )}

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>
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
                className={inputClassName}
              >
                <option value="">Sin marca</option>

                {brands.map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
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
                className={`${inputClassName} min-h-[120px] resize-y`}
                placeholder="Descripción comercial del producto"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
                Especificaciones
              </label>

              <textarea
                value={formData.specifications}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    specifications: event.target.value,
                  })
                }
                className={`${inputClassName} min-h-[160px] resize-y`}
                placeholder={`Procesador: ...
Memoria RAM: ...
Almacenamiento: ...
Pantalla: ...`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
                Garantía
              </label>

              <textarea
                value={formData.warranty}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    warranty: event.target.value,
                  })
                }
                className={`${inputClassName} min-h-[120px] resize-y`}
                placeholder="Condiciones y duración de la garantía"
              />
            </div>

            <div>
              <label className={labelClassName}>
                Precio ($)
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={formData.price}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    price: Number(event.target.value),
                  })
                }
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label className={labelClassName}>
                Stock
              </label>

              <input
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    stock: Number(event.target.value),
                  })
                }
                className={inputClassName}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
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
                className={inputClassName}
                placeholder="https://..."
              />
            </div>

            {formData.imageUrl.trim() !== "" && (
              <div className="md:col-span-2">
                <label className={labelClassName}>
                  Vista previa
                </label>

                <div className="mt-2 flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa del producto"
                    className="max-h-56 max-w-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border-2 border-slate-200 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-[#97cf00] transition-all hover:bg-[#0066FF] hover:text-white"
            >
              {isEditing
                ? "Guardar cambios"
                : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;