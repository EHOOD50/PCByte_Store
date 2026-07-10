import React from "react";

import Sidebar from "../components/layout/Sidebar";
import ProductCatalog from "../components/product/ProductCatalog";
import type { Product } from "../types/types";

interface ProductsProps {
  filter: string;
  setFilter: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  currentProducts: Product[];
  loadingProducts: boolean;
  totalProducts: number;
  activeCategory: string;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function Products({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  currentProducts,
  loadingProducts,
  totalProducts,
  activeCategory,
  searchTerm,
  currentPage,
  totalPages,
  setCurrentPage,
  onSelectProduct,
  onAddToCart,
}: ProductsProps) {
  return (
    <>
      <Sidebar
        activeCategory={filter}
        onSelectCategory={setFilter}
      />

      <main className="flex-1 overflow-y-auto px-8 pt-0 pb-20 custom-scrollbar">
        <ProductCatalog
          products={currentProducts}
          loading={loadingProducts}
          totalProducts={totalProducts}
          activeCategory={activeCategory}
          searchTerm={searchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
        />
      </main>
    </>
  );
}