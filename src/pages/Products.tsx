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

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-20">
        <ProductCatalog
          products={currentProducts}
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