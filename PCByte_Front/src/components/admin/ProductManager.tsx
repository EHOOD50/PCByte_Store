import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import adminApi from "../../api/adminApi";

import ProductToolbar from "./product/ProductToolbar";
import ProductTable from "./product/ProductTable";
import ProductModal, {
  type ProductFormData,
} from "./product/ProductModal";
import ConfirmDeleteModal from "./product/ConfirmDeleteModal";

import type {
  Product,
  Category,
  Brand,
} from "../../types/types";

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [showProductModal, setShowProductModal] =
    useState(false);

  const [showCategoryModal, setShowCategoryModal] =
    useState(false);

  const [productToDelete, setProductToDelete] =
    useState<Product | null>(null);

  const [formData, setFormData] =
    useState<ProductFormData>({
      id: null,
      internalCode: "",
      sku: "",
      mpn: "",
      name: "",
      description: "",
      specifications: "",
      warranty: "",
      price: 0,
      stock: 0,
      active: true,
      categoryId: 0,
      brandId: null,
      imageUrl: "",
    });

  const fetchInventoryData = async () => {
    setLoading(true);

    try {
      const [
        productsResponse,
        categoriesResponse,
        brandsResponse,
      ] = await Promise.all([
        adminApi.get("/products?size=100"),
        adminApi.get("/categories"),
        adminApi.get("/brands"),
      ]);

      const productsContent =
        productsResponse.data?._embedded?.products ??
        productsResponse.data?.content ??
        productsResponse.data ??
        [];

      const categoriesContent =
        categoriesResponse.data?._embedded?.categories ??
        categoriesResponse.data?.content ??
        categoriesResponse.data ??
        [];

      const brandsContent =
        brandsResponse.data?._embedded?.brands ??
        brandsResponse.data?.content ??
        brandsResponse.data ??
        [];

      const cleanProducts: Product[] =
        Array.isArray(productsContent)
          ? productsContent
          : [];

      const cleanCategories: Category[] =
        Array.isArray(categoriesContent)
          ? categoriesContent
          : [];

      const cleanBrands: Brand[] =
        Array.isArray(brandsContent)
          ? brandsContent
          : [];

      setProducts(cleanProducts);
      setCategories(cleanCategories);
      setBrands(cleanBrands);

      setFormData((previous) => ({
        ...previous,
        categoryId:
          previous.categoryId ||
          cleanCategories[0]?.id ||
          0,
        brandId:
          previous.brandId ??
          cleanBrands[0]?.id ??
          null,
      }));
    } catch (error) {
      console.error(
        "Error al cargar el inventario:",
        error
      );

      toast.error(
        "No se pudo cargar el inventario."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInventoryData();
  }, []);

  const editProduct = (product: Product) => {
    setFormData({
      id: product.id,
      internalCode: product.internalCode ?? "",
      sku: product.sku ?? "",
      mpn: product.mpn ?? "",
      name: product.name,
      description: product.description ?? "",
      specifications:
        product.specifications ?? "",
      warranty: product.warranty ?? "",
      price: Number(product.price),
      stock: Number(product.stock),
      active: product.active ?? true,

      categoryId:
  product.categoryId ??
  product.category?.id ??
  0,

brandId:
  product.brandId ??
  product.brand?.id ??
  null,

      imageUrl: product.imageUrl ?? "",
    });

    setShowProductModal(true);
  };

  const openNewProductModal = () => {
    setFormData({
      id: null,
      internalCode: "",
      sku: "",
      mpn: "",
      name: "",
      description: "",
      specifications: "",
      warranty: "",
      price: 0,
      stock: 0,
      active: true,
      categoryId: categories[0]?.id ?? 0,
      brandId: brands[0]?.id ?? null,
      imageUrl: "",
    });

    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
  };

  const saveProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (formData.categoryId === 0) {
      toast.error(
        "Debes seleccionar una categoría."
      );
      return;
    }

    const productPayload = {
      sku: formData.sku.trim() || null,
      mpn: formData.mpn.trim() || null,

      name: formData.name.trim(),
      description:
        formData.description.trim() || null,

      specifications:
        formData.specifications.trim() || null,

      warranty:
        formData.warranty.trim() || null,

      price: Number(formData.price),
      stock: Number(formData.stock),
      active: formData.active,

      categoryId: Number(
        formData.categoryId
      ),

      brandId:
        formData.brandId !== null
          ? Number(formData.brandId)
          : null,

      imageUrl:
        formData.imageUrl.trim() || null,
    };

    try {
      if (formData.id !== null) {
        await adminApi.put(
          `/products/${formData.id}`,
          productPayload
        );
      } else {
        await adminApi.post(
          "/products",
          productPayload
        );
      }

      toast.success(
        formData.id !== null
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente."
      );

      setShowProductModal(false);
      await fetchInventoryData();
    } catch (error) {
      console.error(
        "Error al guardar el producto:",
        error
      );

      if (axios.isAxiosError(error)) {
        console.error(
          "Respuesta del backend:",
          error.response?.data
        );
      }

      toast.error(
        formData.id !== null
          ? "No se pudo actualizar el producto."
          : "No se pudo crear el producto."
      );
    }
  };

  const requestDeleteProduct = (
    product: Product
  ) => {
    setProductToDelete(product);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await adminApi.delete(
        `/products/${productToDelete.id}`
      );

      toast.success(
        "Producto eliminado correctamente."
      );

      setProductToDelete(null);
      await fetchInventoryData();
    } catch (error: unknown) {
      console.error(
        "Error al eliminar el producto:",
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

        const isRelatedToOrders =
          backendMessage.includes(
            "order_items"
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

        if (isRelatedToOrders) {
          toast.error(
            "Este producto está asociado a uno o más pedidos y no puede eliminarse."
          );

          setProductToDelete(null);
          return;
        }
      }

      toast.error(
        "No se pudo eliminar el producto."
      );

      setProductToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-[2.5rem] border-2 border-slate-100 bg-white p-10">
        <p className="text-sm font-bold text-slate-500">
          Cargando inventario...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductToolbar
        onNewProduct={openNewProductModal}
        onManageCategories={() =>
          setShowCategoryModal(true)
        }
      />

      <ProductTable
        products={products}
        onEdit={editProduct}
        onDelete={requestDeleteProduct}
      />

      <ProductModal
        isOpen={showProductModal}
        formData={formData}
        categories={categories}
        brands={brands}
        onClose={closeProductModal}
        onChange={setFormData}
        onSubmit={saveProduct}
      />

      <ConfirmDeleteModal
        isOpen={productToDelete !== null}
        title="Eliminar producto"
        message={
          productToDelete
            ? `¿Estás seguro de que deseas eliminar "${productToDelete.name}"?`
            : ""
        }
        onCancel={() =>
          setProductToDelete(null)
        }
        onConfirm={confirmDeleteProduct}
      />

      {showCategoryModal && (
        <div className="hidden">
          Modal de categorías pendiente.
        </div>
      )}
    </div>
  );
};

export default ProductManager;