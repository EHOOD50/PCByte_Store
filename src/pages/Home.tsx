import React from "react";
import { Activity, ArrowUpDown } from "lucide-react";
import FeaturedProducts from "../components/home/FeaturedProducts";
import type { Product } from "../types/types";
import TechnicalService from "../components/home/TechnicalService";
import Sidebar from "../components/layout/Sidebar";
import Hero from "../components/home/Hero";
import WhyChoosePCByte from "../components/home/WhyChoosePCByte";
import ProductCard from "../components/ProductCard";

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

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Activity
              size={14}
              className="text-[#97cf00]"
            />

            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Productos encontrados: {processedProducts.length}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
            <ArrowUpDown
              size={14}
              className="text-[#0066FF]"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-[10px] font-black uppercase outline-none bg-transparent cursor-pointer text-white"
            >
              <option
                className="bg-slate-900"
                value="default"
              >
                Relevancia
              </option>

              <option
                className="bg-slate-900"
                value="price-asc"
              >
                Precio: Menor a Mayor
              </option>

              <option
                className="bg-slate-900"
                value="price-desc"
              >
                Precio: Mayor a Menor
              </option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="cursor-pointer"
            >
              <ProductCard
                product={p}
                addToCart={(e: any) => {
                  e.stopPropagation();
                  onAddToCart(p);
                }}
              />
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase disabled:opacity-20 hover:border-[#97cf00]"
            >
              Back
            </button>

            <span className="text-[10px] font-black uppercase text-slate-500">
              Pág {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-6 py-2 bg-[#0066FF] text-white rounded-xl font-black text-[10px] uppercase disabled:opacity-20 hover:bg-[#97cf00]"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export default Home;