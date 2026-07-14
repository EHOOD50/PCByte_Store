import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import adminApi from "../../api/adminApi";

import CategoryToolbar from "./category/CategoryToolbar";
import CategoryTable from "./category/CategoryTable";
import CategoryModal from "./category/CategoryModal";
import ConfirmDeleteModal from "./product/ConfirmDeleteModal";

import type { Category } from "../../types/types";

interface CategoryFormData {
  id: number | null;
  name: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  const [categoryToDelete, setCategoryToDelete] =
    useState<Category | null>(null);

  const [formData, setFormData] =
    useState<CategoryFormData>({
      id: null,
      name: "",
    });

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const response =
        await adminApi.get("/categories");

      const categoriesContent =
        response.data?._embedded?.categories ??
        response.data?.content ??
        response.data ??
        [];

      const cleanCategories: Category[] =
        Array.isArray(categoriesContent)
          ? categoriesContent
          : [];

      setCategories(cleanCategories);
    } catch (error) {
      console.error(
        "Error al cargar las categorías:",
        error
      );

      toast.error(
        "No se pudieron cargar las categorías."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  const openNewCategoryModal = () => {
    setFormData({
      id: null,
      name: "",
    });

    setShowCategoryModal(true);
  };

  const editCategory = (
    category: Category
  ) => {
    setFormData({
      id: category.id ?? null,
      name: category.name,
    });

    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);

    setFormData({
      id: null,
      name: "",
    });
  };

  const saveCategory = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const categoryName =
      formData.name.trim();

    if (!categoryName) {
      toast.error(
        "El nombre de la categoría es obligatorio."
      );
      return;
    }

    const payload = {
      name: categoryName,
    };

    try {
      if (formData.id !== null) {
        await adminApi.put(
          `/categories/${formData.id}`,
          payload
        );
      } else {
        await adminApi.post(
          "/categories",
          payload
        );
      }

      toast.success(
        formData.id !== null
          ? "Categoría actualizada correctamente."
          : "Categoría creada correctamente."
      );

      closeCategoryModal();
      await fetchCategories();
    } catch (error: unknown) {
      console.error(
        "Error al guardar la categoría:",
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
            "Ya existe una categoría con ese nombre."
          );
          return;
        }
      }

      toast.error(
        formData.id !== null
          ? "No se pudo actualizar la categoría."
          : "No se pudo crear la categoría."
      );
    }
  };

  const requestDeleteCategory = (
    category: Category
  ) => {
    setCategoryToDelete(category);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete?.id) return;

    try {
      await adminApi.delete(
        `/categories/${categoryToDelete.id}`
      );

      toast.success(
        "Categoría eliminada correctamente."
      );

      setCategoryToDelete(null);
      await fetchCategories();
    } catch (error: unknown) {
      console.error(
        "Error al eliminar la categoría:",
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
            "Esta categoría no puede eliminarse porque tiene productos asociados."
          );

          setCategoryToDelete(null);
          return;
        }
      }

      toast.error(
        "No se pudo eliminar la categoría."
      );

      setCategoryToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-10">
        <p className="text-sm font-bold text-slate-500">
          Cargando categorías...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CategoryToolbar
        onNewCategory={
          openNewCategoryModal
        }
      />

      <CategoryTable
        categories={categories}
        onEdit={editCategory}
        onDelete={
          requestDeleteCategory
        }
      />

      <CategoryModal
        isOpen={showCategoryModal}
        formData={formData}
        onClose={closeCategoryModal}
        onChange={setFormData}
        onSubmit={saveCategory}
      />

      <ConfirmDeleteModal
        isOpen={
          categoryToDelete !== null
        }
        title="Eliminar categoría"
        message={
          categoryToDelete
            ? `¿Estás seguro de que deseas eliminar "${categoryToDelete.name}"?`
            : ""
        }
        onCancel={() =>
          setCategoryToDelete(null)
        }
        onConfirm={
          confirmDeleteCategory
        }
      />
    </div>
  );
};

export default CategoryManager;