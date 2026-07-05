import {
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import type { Product } from "../../../types/types";

interface ProductPurchasePanelProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductPurchasePanel({
  product,
  onAddToCart,
}: ProductPurchasePanelProps) {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="sticky top-28 flex flex-col rounded-[2.5rem] border border-white/10 bg-[#111111]/90 p-8 shadow-2xl backdrop-blur-xl">
      <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#97cf00]">
        {product.category?.name ?? "Producto"}
      </span>

      <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-tight text-white">
        {product.name}
      </h1>

      <div className="mt-6 text-5xl font-black tracking-tight text-white">
        ${product.price.toLocaleString("es-CL")}
      </div>

      <div className="mt-6">
        {isOutOfStock ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-400">
            <AlertTriangle size={14} />
            Sin stock disponible
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-orange-400">
            <AlertTriangle size={14} />
            Últimas {product.stock} unidades
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#97cf00]/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#97cf00]">
            <CheckCircle2 size={14} />
            Disponible para compra
          </span>
        )}
      </div>

      <button
        disabled={isOutOfStock}
        onClick={() => onAddToCart(product)}
        className={`mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
          isOutOfStock
            ? "cursor-not-allowed bg-white/10 text-slate-500"
            : "bg-[#0066FF] text-white shadow-lg shadow-blue-500/20 hover:bg-[#97cf00] hover:text-black active:scale-95"
        }`}
      >
        <ShoppingCart size={17} />
        {isOutOfStock ? "Sin stock" : "Agregar al carrito"}
      </button>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <ShieldCheck size={18} className="mb-2 text-[#97cf00]" />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
            Garantía local
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Truck size={18} className="mb-2 text-[#97cf00]" />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
            Envíos a Chile
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Wrench size={18} className="mb-2 text-[#97cf00]" />
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
            Soporte técnico
          </p>
        </div>
      </div>
    </div>
  );
}