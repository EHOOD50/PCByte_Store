import React from "react";
import FeaturedProducts from "../components/home/FeaturedProducts";
import type { Product } from "../types/types";
import TechnicalService from "../components/home/TechnicalService";
import Sidebar from "../components/layout/Sidebar";
import Hero from "../components/home/Hero";
import WhyChoosePCByte from "../components/home/WhyChoosePCByte";
import ProductCatalog from "../components/product/ProductCatalog";

interface HomeProps {
  filter: string;
  setFilter: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  processedProducts: Product[];
  currentProducts: Product[];

  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

function Home({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  processedProducts,
  currentProducts,
  currentPage,
  totalPages,
  setCurrentPage,
  onSelectProduct,
  onAddToCart,
}: HomeProps) {
  return (
    <>
      <Sidebar
        activeCategory={filter}
        onSelectCategory={setFilter}
      />

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-20">
        <Hero onSelectCategory={setFilter} />

        <WhyChoosePCByte />
        <FeaturedProducts
  products={processedProducts}
  onSelectProduct={onSelectProduct}
  onAddToCart={onAddToCart}
/>
        <TechnicalService />

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

export default Home;