import React from "react";
import { Activity, ArrowUpDown } from "lucide-react";
import type { Product } from "../../types/types";
import ProductCard from "../ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import EmptyCatalog from "./EmptyCatalog";

interface ProductCatalogProps {
  products: Product[];
  loading: boolean;

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
  loading,
  sortBy,
  setSortBy,
  currentPage,
  totalPages,
  setCurrentPage,
  onSelectProduct,
  onAddToCart,
}: ProductCatalogProps) {
  return (
    <section className="mt-3">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
  <div>
    <div className="mb-2 flex items-center gap-2">
      <Activity size={14} className="text-[#97cf00]" />

      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#97cf00]">
        Catálogo PCByte
      </span>
    </div>

    <h1 className="text-3xl font-black uppercase tracking-tight text-white">
      Productos
    </h1>

    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
      Encuentra componentes, periféricos y equipos seleccionados para potenciar tu setup.
    </p>

    <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
      {loading ? "Cargando productos..." : `${products.length} productos disponibles`}
    </p>
  </div>

  <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 lg:w-auto lg:min-w-[230px]">
    <div className="flex items-center gap-2">
      <ArrowUpDown size={14} className="text-[#0066FF]" />

      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
        Ordenar
      </span>
    </div>

    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      disabled={loading}
      className="cursor-pointer bg-transparent text-[10px] font-black uppercase text-white outline-none disabled:cursor-not-allowed disabled:opacity-40"
    >
      <option className="bg-slate-900" value="default">
        Relevancia
      </option>

      <option className="bg-slate-900" value="price-asc">
        Menor precio
      </option>

      <option className="bg-slate-900" value="price-desc">
        Mayor precio
      </option>
    </select>
  </div>
</div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
  Array.from({ length: 8 }).map((_, index) => (
    <ProductSkeleton key={index} />
  ))
) : products.length === 0 ? (
  <EmptyCatalog />
) : (
  products.map((product) => (
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
  ))
)}
      </div>

      {!loading && totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-[10px] font-black uppercase transition-all hover:border-[#97cf00] disabled:opacity-20"
          >
            Back
          </button>

          <span className="text-[10px] font-black uppercase text-slate-500">
            Página {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded-xl bg-[#0066FF] px-6 py-2 text-[10px] font-black uppercase text-white transition-all hover:bg-[#97cf00] disabled:opacity-20"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}