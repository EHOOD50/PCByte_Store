import React from "react";
import { Activity, ArrowUpDown } from "lucide-react";
import type { Product } from "../../types/types";
import ProductCard from "../ProductCard";

interface ProductCatalogProps {
  products: Product[];
  sortBy: string;
  setSortBy: (value: string) => void;

  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;

  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductCatalog({
  products,
  sortBy,
  setSortBy,
  currentPage,
  totalPages,
  setCurrentPage,
  onSelectProduct,
  onAddToCart,
}: ProductCatalogProps) {
  return (
    <section className="mt-20">
      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-2">
          <Activity
            size={14}
            className="text-[#97cf00]"
          />

          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Catálogo · {products.length} productos
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
            <option className="bg-slate-900" value="default">
              Relevancia
            </option>

            <option className="bg-slate-900" value="price-asc">
              Precio: Menor a Mayor
            </option>

            <option className="bg-slate-900" value="price-desc">
              Precio: Mayor a Menor
            </option>

          </select>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="cursor-pointer"
          >
            <ProductCard
              product={product}
              addToCart={(e: React.MouseEvent) => {
                e.stopPropagation();
                onAddToCart(product);
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
            Página {currentPage} / {totalPages}
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

    </section>
  );
}