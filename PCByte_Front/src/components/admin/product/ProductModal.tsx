import React, { useRef, useState } from "react";
import {
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { uploadProductImage } from "../../../api/imageApi";

import type {
  Brand,
  Category,
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
  onChange: React.Dispatch<
    React.SetStateAction<ProductFormData>
  >;
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
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [imageLoadError, setImageLoadError] =
    useState(false);

  if (!isOpen) {
    return null;
  }

  const isEditing = formData.id !== null;

  const handleImageSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!validImageTypes.includes(file.type)) {
      toast.error(
        "Selecciona una imagen JPG, PNG, WEBP o GIF."
      );

      event.target.value = "";
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      toast.error(
        "La imagen no puede superar los 5 MB."
      );

      event.target.value = "";
      return;
    }

    setUploadingImage(true);
    setImageLoadError(false);

    try {
      const uploadedImageUrl =
        await uploadProductImage(file);

      onChange((previous) => ({
        ...previous,
        imageUrl: uploadedImageUrl,
      }));

      toast.success(
        "Imagen subida correctamente."
      );
    } catch (error) {
      console.error(
        "Error al subir la imagen:",
        error
      );

      toast.error(
        "No se pudo subir la imagen."
      );
    } finally {
      setUploadingImage(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = () => {
    onChange((previous) => ({
      ...previous,
      imageUrl: "",
    }));

    setImageLoadError(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (uploadingImage) {
      toast.error(
        "Espera a que termine la subida de la imagen."
      );
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-[2.5rem] border-b-8 border-[#97cf00] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-slate-50 px-8 py-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
              Gestión de inventario
            </p>

            <h3 className="mt-1 text-xl font-black uppercase italic tracking-tighter text-slate-900">
              {isEditing
                ? "Editar Producto"
                : "Nuevo Producto"}
            </h3>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={uploadingImage}
            className="rounded-full bg-white p-2 text-red-500 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
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
                value={
                  formData.active
                    ? "true"
                    : "false"
                }
                onChange={(event) =>
                  onChange({
                    ...formData,
                    active:
                      event.target.value ===
                      "true",
                  })
                }
                className={inputClassName}
              >
                <option value="true">
                  Activo
                </option>

                <option value="false">
                  Inactivo
                </option>
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
                    categoryId: Number(
                      event.target.value
                    ),
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

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name.toUpperCase()}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className={labelClassName}>
                Marca
              </label>

              <select
                value={
                  formData.brandId ?? ""
                }
                onChange={(event) =>
                  onChange({
                    ...formData,
                    brandId:
                      event.target.value
                        ? Number(
                            event.target
                              .value
                          )
                        : null,
                  })
                }
                className={inputClassName}
              >
                <option value="">
                  Sin marca
                </option>

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
                Imagen del producto
              </label>

              <div className="mt-2 overflow-hidden rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50">
                <div className="flex min-h-[290px] items-center justify-center p-6">
                  {uploadingImage ? (
                    <div className="flex flex-col items-center text-center">
                      <LoaderCircle
                        size={46}
                        className="animate-spin text-[#0066FF]"
                      />

                      <p className="mt-4 text-sm font-black uppercase text-slate-700">
                        Subiendo imagen...
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Espera mientras Cloudinary
                        procesa el archivo.
                      </p>
                    </div>
                  ) : formData.imageUrl &&
                    !imageLoadError ? (
                    <div className="relative flex w-full flex-col items-center">
                      <img
                        src={formData.imageUrl}
                        alt={`Vista previa de ${formData.name || "producto"}`}
                        onLoad={() =>
                          setImageLoadError(
                            false
                          )
                        }
                        onError={() =>
                          setImageLoadError(
                            true
                          )
                        }
                        className="max-h-[260px] max-w-full object-contain"
                      />

                      <div className="mt-5 flex items-center gap-2 rounded-full bg-[#97cf00]/15 px-4 py-2 text-[10px] font-black uppercase text-[#648a00]">
                        <CheckCircle2
                          size={16}
                        />
                        Imagen cargada
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="rounded-full bg-white p-5 shadow-sm">
                        <ImagePlus
                          size={42}
                          className="text-slate-300"
                        />
                      </div>

                      <p className="mt-4 text-sm font-black uppercase text-slate-700">
                        Sin imagen
                      </p>

                      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400">
                        Selecciona una imagen
                        clara del producto en
                        formato JPG, PNG, WEBP o
                        GIF.
                      </p>

                      {imageLoadError && (
                        <p className="mt-3 text-xs font-bold text-red-500">
                          No se pudo mostrar la
                          imagen guardada.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-5 sm:flex-row sm:justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={
                      handleImageSelection
                    }
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    disabled={uploadingImage}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-[#97cf00] transition hover:bg-[#0066FF] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Upload size={18} />

                    {formData.imageUrl
                      ? "Cambiar imagen"
                      : "Seleccionar imagen"}
                  </button>

                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={removeImage}
                      disabled={
                        uploadingImage
                      }
                      className="flex items-center justify-center gap-2 rounded-2xl border-2 border-red-100 bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Trash2 size={18} />
                      Quitar imagen
                    </button>
                  )}
                </div>
              </div>

              <p className="ml-1 mt-2 text-[10px] font-semibold text-slate-400">
                Tamaño máximo: 5 MB.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className={labelClassName}>
                Descripción
              </label>

              <textarea
                value={
                  formData.description
                }
                onChange={(event) =>
                  onChange({
                    ...formData,
                    description:
                      event.target.value,
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
                value={
                  formData.specifications
                }
                onChange={(event) =>
                  onChange({
                    ...formData,
                    specifications:
                      event.target.value,
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
                    warranty:
                      event.target.value,
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
                    price: Number(
                      event.target.value
                    ),
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
                    stock: Number(
                      event.target.value
                    ),
                  })
                }
                className={inputClassName}
                required
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploadingImage}
              className="rounded-2xl border-2 border-slate-200 px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                uploadingImage ||
                categories.length === 0
              }
              className="rounded-2xl bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-[#97cf00] transition-all hover:bg-[#0066FF] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {uploadingImage
                ? "Subiendo imagen..."
                : isEditing
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