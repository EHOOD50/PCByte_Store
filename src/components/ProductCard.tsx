import React from "react";
import type { Product } from "../types/types";
import { ShoppingCart, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  addToCart: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#97cf00]/70 hover:shadow-[0_20px_45px_rgba(151,207,0,0.18)]">
      <div className="relative m-4 mb-0 flex aspect-square items-center justify-center overflow-hidden rounded-[1.35rem] bg-slate-50 p-5">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute left-3 top-3">
          {isOutOfStock ? (
            <span className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white">
              <AlertTriangle size={11} />
              Sin stock
            </span>
          ) : isLowStock ? (
            <span className="flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white">
              <AlertTriangle size={11} />
              Últimas {product.stock}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-[#97cf00] px-3 py-1 text-[8px] font-black uppercase tracking-widest text-black">
              <CheckCircle2 size={11} />
              Disponible
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
          {product.category?.name ?? "Producto"}
        </span>

        <h3 className="min-h-[2.7rem] text-sm font-black leading-tight text-slate-900 line-clamp-2">
          {product.name}
        </h3>

        <div className="mt-auto pt-5">
          <p className="mb-4 text-2xl font-black tracking-tight text-slate-950">
            ${product.price.toLocaleString("es-CL")}
          </p>

          <button
            onClick={addToCart}
            disabled={isOutOfStock}
            className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              isOutOfStock
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-[#0066FF] text-white shadow-lg shadow-blue-500/20 hover:scale-[1.03] hover:bg-[#97cf00] hover:text-black hover:shadow-[#97cf00]/30 active:scale-95"
            }`}
          >
            <ShoppingCart size={15} />
            {isOutOfStock ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;