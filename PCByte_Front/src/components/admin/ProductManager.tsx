import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import ProductToolbar from "./product/ProductToolbar";
import ProductTable from "./product/ProductTable";
import ProductModal from "./product/ProductModal";

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

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    id: null,
    name: "",
    description: "",
    price: 0,
    stock: 0,
    categoryId: 0,
    brandId: null,
    imageUrl: "",
  });

  const fetchInventoryData = async () => {
    setLoading(true);

    try {
      const [productsResponse, categoriesResponse, brandsResponse] =
        await Promise.all([
          adminApi.get("/products?size=100"),
          adminApi.get("/categories"),
          adminApi.get("/brands"),
        ]);

      const productsContent =
        productsResponse.data?._embedded?.products ||
        productsResponse.data?.content ||
        productsResponse.data ||
        [];

      const categoriesContent =
        categoriesResponse.data?._embedded?.categories ||
        categoriesResponse.data ||
        [];

      const brandsContent =
        brandsResponse.data?._embedded?.brands ||
        brandsResponse.data ||
        [];

      const cleanProducts = Array.isArray(productsContent)
        ? productsContent
        : [];

      const cleanCategories = Array.isArray(categoriesContent)
        ? categoriesContent
        : [];

      const cleanBrands = Array.isArray(brandsContent)
        ? brandsContent
        : [];

      setProducts(cleanProducts);
      setCategories(cleanCategories);
      setBrands(cleanBrands);

      setFormData((previous) => ({
        ...previous,
        categoryId: previous.categoryId || cleanCategories[0]?.id || 0,
        brandId: previous.brandId ?? cleanBrands[0]?.id ?? null,
      }));
    } catch (error) {
      console.error("Error al cargar el inventario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const deleteProduct = async (productId: number) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );

    if (!confirmed) return;

    try {
      await adminApi.delete(`/products/${productId}`);
      await fetchInventoryData();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("No se pudo eliminar el producto.");
    }
  };

  const editProduct = (product: any) => {
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: Number(product.price),
      stock: Number(product.stock),
      categoryId: product.category?.id ?? product.categoryId ?? 0,
      brandId: product.brand?.id ?? product.brandId ?? null,
      imageUrl: product.imageUrl ?? "",
    });

    setShowProductModal(true);
  };

  const openNewProductModal = () => {
    setFormData({
      id: null,
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: categories[0]?.id ?? 0,
      brandId: brands[0]?.id ?? null,
      imageUrl: "",
    });

    setShowProductModal(true);
  };

  const saveProduct = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const productPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: Number(formData.categoryId),
      brandId: formData.brandId
        ? Number(formData.brandId)
        : null,
      imageUrl: formData.imageUrl.trim(),
    };

    try {
      if (formData.id !== null) {
        await adminApi.put(
          `/products/${formData.id}`,
          productPayload
        );
      } else {
        await adminApi.post("/products", productPayload);
      }

      setShowProductModal(false);
      await fetchInventoryData();
    } catch (error) {
      console.error("Error al guardar el producto:", error);

      alert(
        formData.id !== null
          ? "No se pudo actualizar el producto."
          : "No se pudo crear el producto."
      );
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
        onManageCategories={() => setShowCategoryModal(true)}
      />

      <ProductTable
        products={products}
        onEdit={editProduct}
        onDelete={deleteProduct}
      />

      <ProductModal
        isOpen={showProductModal}
        formData={formData}
        categories={categories}
        brands={brands}
        onClose={() => setShowProductModal(false)}
        onChange={setFormData}
        onSubmit={saveProduct}
      />
    </div>
  );
};

export default ProductManager;