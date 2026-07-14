import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import adminApi from "../../api/adminApi";

import BrandToolbar from "./brand/BrandToolbar";
import BrandTable from "./brand/BrandTable";
import BrandModal, {
  type BrandFormData,
} from "./brand/BrandModal";
import ConfirmDeleteModal from "./product/ConfirmDeleteModal";

import type { Brand } from "../../types/types";

const BrandManager: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBrandModal, setShowBrandModal] =
    useState(false);

  const [brandToDelete, setBrandToDelete] =
    useState<Brand | null>(null);

  const [formData, setFormData] =
    useState<BrandFormData>({
      id: null,
      name: "",
      logoUrl: "",
      website: "",
      active: true,
    });

  const fetchBrands = async () => {
    setLoading(true);

    try {
      const response =
        await adminApi.get("/brands");

      const brandsContent =
        response.data?._embedded?.brands ??
        response.data?.content ??
        response.data ??
        [];

      const cleanBrands: Brand[] =
        Array.isArray(brandsContent)
          ? brandsContent
          : [];

      setBrands(cleanBrands);
    } catch (error) {
      console.error(
        "Error al cargar las marcas:",
        error
      );

      toast.error(
        "No se pudieron cargar las marcas."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBrands();
  }, []);

  const openNewBrandModal = () => {
    setFormData({
      id: null,
      name: "",
      logoUrl: "",
      website: "",
      active: true,
    });

    setShowBrandModal(true);
  };

  const editBrand = (brand: Brand) => {
    setFormData({
      id: brand.id ?? null,
      name: brand.name,
      logoUrl: brand.logoUrl ?? "",
      website: brand.website ?? "",
      active: brand.active ?? true,
    });

    setShowBrandModal(true);
  };

  const closeBrandModal = () => {
    setShowBrandModal(false);

    setFormData({
      id: null,
      name: "",
      logoUrl: "",
      website: "",
      active: true,
    });
  };

  const saveBrand = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const brandName =
      formData.name.trim();

    if (!brandName) {
      toast.error(
        "El nombre de la marca es obligatorio."
      );
      return;
    }

    const brandPayload = {
      name: brandName,
      logoUrl:
        formData.logoUrl.trim() || null,
      website:
        formData.website.trim() || null,
      active: formData.active,
    };

    try {
      if (formData.id !== null) {
        await adminApi.put(
          `/brands/${formData.id}`,
          brandPayload
        );
      } else {
        await adminApi.post(
          "/brands",
          brandPayload
        );
      }

      toast.success(
        formData.id !== null
          ? "Marca actualizada correctamente."
          : "Marca creada correctamente."
      );

      closeBrandModal();
      await fetchBrands();
    } catch (error: unknown) {
      console.error(
        "Error al guardar la marca:",
        error
      );

      if (axios.isAxiosError(error)) {
        const responseData =
          error.response?.data;

        const backendMessage = String(
          responseData?.message ??
            responseData?.error ??
            responseData ??
            ""
        ).toLowerCase();

        const isDuplicate =
          backendMessage.includes(
            "ya existe"
          ) ||
          backendMessage.includes(
            "duplicate"
          ) ||
          backendMessage.includes(
            "unique"
          );

        if (isDuplicate) {
          toast.error(
            "Ya existe una marca con ese nombre."
          );
          return;
        }
      }

      toast.error(
        formData.id !== null
          ? "No se pudo actualizar la marca."
          : "No se pudo crear la marca."
      );
    }
  };

  const requestDeleteBrand = (
    brand: Brand
  ) => {
    setBrandToDelete(brand);
  };

  const confirmDeleteBrand = async () => {
    if (!brandToDelete?.id) {
      return;
    }

    try {
      await adminApi.delete(
        `/brands/${brandToDelete.id}`
      );

      toast.success(
        "Marca eliminada correctamente."
      );

      setBrandToDelete(null);
      await fetchBrands();
    } catch (error: unknown) {
      console.error(
        "Error al eliminar la marca:",
        error
      );

      if (axios.isAxiosError(error)) {
        const responseData =
          error.response?.data;

        const backendMessage = String(
          responseData?.message ??
            responseData?.error ??
            responseData ??
            ""
        ).toLowerCase();

        const isRelatedToProducts =
          backendMessage.includes(
            "products"
          ) ||
          backendMessage.includes(
            "product"
          ) ||
          backendMessage.includes(
            "llave foránea"
          ) ||
          backendMessage.includes(
            "foreign key"
          ) ||
          backendMessage.includes(
            "constraint"
          );

        if (isRelatedToProducts) {
          toast.error(
            "Esta marca no puede eliminarse porque tiene productos asociados."
          );

          setBrandToDelete(null);
          return;
        }
      }

      toast.error(
        "No se pudo eliminar la marca."
      );

      setBrandToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-10">
        <p className="text-sm font-bold text-slate-500">
          Cargando marcas...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BrandToolbar
        onNewBrand={openNewBrandModal}
      />

      <BrandTable
        brands={brands}
        onEdit={editBrand}
        onDelete={requestDeleteBrand}
      />

      <BrandModal
        isOpen={showBrandModal}
        formData={formData}
        onClose={closeBrandModal}
        onChange={setFormData}
        onSubmit={saveBrand}
      />

      <ConfirmDeleteModal
        isOpen={brandToDelete !== null}
        title="Eliminar marca"
        message={
          brandToDelete
            ? `¿Estás seguro de que deseas eliminar "${brandToDelete.name}"?`
            : ""
        }
        onCancel={() =>
          setBrandToDelete(null)
        }
        onConfirm={confirmDeleteBrand}
      />
    </div>
  );
};

export default BrandManager;