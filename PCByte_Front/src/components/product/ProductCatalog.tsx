import React, { useEffect, useRef } from "react";
import { ArrowUpDown } from "lucide-react";

import type { Product } from "../../types/types";
import ProductCard from "../ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import EmptyCatalog from "./EmptyCatalog";

interface ProductCatalogProps {
  products: Product[];
  loading: boolean;
  totalProducts: number;
  activeCategory: string;
  searchTerm: string;
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
  totalProducts,
  activeCategory,
  searchTerm,
  sortBy,
  setSortBy,
  currentPage,
  totalPages,
  setCurrentPage,
  onSelectProduct,
  onAddToCart,
}: ProductCatalogProps) {
  const catalogRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    catalogRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  const headerTitle =
    searchTerm.trim() !== ""
      ? `"${searchTerm}"`
      : activeCategory !== "TODOS"
        ? activeCategory
        : "PRODUCTOS";

  const headerSubtitle =
    searchTerm.trim() !== ""
      ? "Resultados de búsqueda"
      : activeCategory !== "TODOS"
        ? "Categoría seleccionada"
        : "Tecnología seleccionada para ti.";

  return (
    <section
      ref={catalogRef}
      className="mt-3 scroll-mt-24"
    >
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#97cf00]">
            {headerSubtitle}
          </span>

          <h1 className="mt-2 text-4xl font-black uppercase tracking-tight text-white">
            {headerTitle}
          </h1>

          <p className="mt-4 text-sm text-slate-400">
            {loading
              ? "Cargando productos..."
              : `${totalProducts} producto${
                  totalProducts !== 1 ? "s" : ""
                } encontrado${
                  totalProducts !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        <div className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 lg:w-auto lg:min-w-[230px]">
          <div className="flex items-center gap-2">
            <ArrowUpDown
              size={14}
              className="text-[#0066FF]"
            />

            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              Ordenar
            </span>
          </div>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
            disabled={loading}
            className="cursor-pointer bg-transparent text-[10px] font-black uppercase text-white outline-none disabled:cursor-not-allowed disabled:opacity-40"
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
              Menor precio
            </option>

            <option
              className="bg-slate-900"
              value="price-desc"
            >
              Mayor precio
            </option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map(
            (_, index) => (
              <ProductSkeleton key={index} />
            )
          )
        ) : products.length === 0 ? (
          <EmptyCatalog />
        ) : (
          products.map((product, index) => (
            <div
              key={product.id}
              onClick={() =>
                onSelectProduct(product)
              }
              className="cursor-pointer animate-[fadeUp_0.45s_ease-out_both]"
              style={{
                animationDelay: `${index * 45}ms`,
              }}
            >
              <ProductCard
                product={product}
                addToCart={(
                  event: React.MouseEvent
                ) => {
                  event.stopPropagation();
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
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                (page) => page - 1
              )
            }
            className="rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-[10px] font-black uppercase transition-all hover:border-[#97cf00] disabled:cursor-not-allowed disabled:opacity-20"
          >
            Anterior
          </button>

          <span className="text-[10px] font-black uppercase text-slate-500">
            Página {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                (page) => page + 1
              )
            }
            className="rounded-xl bg-[#0066FF] px-6 py-2 text-[10px] font-black uppercase text-white transition-all hover:bg-[#97cf00] disabled:cursor-not-allowed disabled:opacity-20"
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}