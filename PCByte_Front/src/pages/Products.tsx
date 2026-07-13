import React, { useState } from "react";
import { Menu, X } from "lucide-react";

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleSelectCategory = (category: string) => {
    setFilter(category);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* SIDEBAR ESCRITORIO */}
      <div className="hidden lg:block">
        <Sidebar
          activeCategory={filter}
          onSelectCategory={setFilter}
          variant="desktop"
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="min-w-0 flex-1 overflow-y-auto px-4 pb-20 pt-3 sm:px-6 lg:px-8 lg:pt-0 custom-scrollbar">
        {/* BOTÓN MÓVIL */}
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-left shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Menu size={19} className="text-[#97cf00]" />

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-500">
                  Categorías
                </p>

                <p className="text-xs font-black uppercase text-white">
                  {filter === "TODOS" ? "Mostrar todo" : filter}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-[#0066FF]/15 px-3 py-1 text-[9px] font-black uppercase text-[#0066FF]">
              Abrir
            </span>
          </button>
        </div>

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

      {/* SIDEBAR MÓVIL */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[300] lg:hidden">
          <button
            type="button"
            aria-label="Cerrar categorías"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="relative h-full w-[88%] max-w-sm bg-[#090909] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between px-2 pt-2">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#97cf00]">
                  Catálogo PCByte
                </p>

                <h2 className="text-lg font-black uppercase italic text-white">
                  Categorías
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="rounded-full bg-white/10 p-2 text-white"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <Sidebar
              activeCategory={filter}
              onSelectCategory={handleSelectCategory}
              variant="mobile"
            />
          </div>
        </div>
      )}
    </>
  );
}