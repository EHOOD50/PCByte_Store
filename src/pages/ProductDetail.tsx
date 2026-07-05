import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle, ShoppingCart, ShieldCheck, Truck, Wrench } from "lucide-react";

import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/types";

interface ProductDetailProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loadingProducts } = useProducts();

  const product = useMemo(() => {
    return products.find((p) => String(p.id) === String(id));
  }, [products, id]);

  if (loadingProducts) {
    return (
      <main className="flex-1 bg-[#0a0a0a] p-8 text-white">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-10 w-40 rounded-xl bg-white/10" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-[420px] rounded-[2rem] bg-white/10" />
            <div className="space-y-5">
              <div className="h-4 w-32 rounded bg-white/10" />
              <div className="h-12 w-3/4 rounded bg-white/10" />
              <div className="h-10 w-48 rounded bg-white/10" />
              <div className="h-28 rounded bg-white/10" />
              <div className="h-14 rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[#0a0a0a] p-8 text-white">
        <div className="max-w-md text-center">
          <h1 className="text-3xl font-black uppercase">Producto no encontrado</h1>
          <p className="mt-4 text-sm text-slate-400">
            El producto que buscas no existe o ya no está disponible.
          </p>

          <button
            onClick={() => navigate("/productos")}
            className="mt-8 rounded-2xl bg-[#0066FF] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#97cf00] hover:text-black"
          >
            Volver al catálogo
          </button>
        </div>
      </main>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <main className="flex-1 overflow-y-auto bg-[#0a0a0a] px-8 py-6 text-white custom-scrollbar">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/productos")}
          className="mb-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all hover:border-[#97cf00]/60 hover:text-white"
        >
          <ArrowLeft size={15} />
          Volver al catálogo
        </button>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2.5rem] border border-white/10 bg-white p-8 shadow-2xl">
            <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] bg-slate-50 p-8">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-[360px] max-w-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-[2.5rem] border border-white/10 bg-[#111111]/80 p-8 shadow-2xl">
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

            <p className="mt-8 border-l-4 border-[#0066FF] pl-5 text-sm leading-7 text-slate-300">
              {product.description || "Producto seleccionado por PCByte para potenciar tu equipo o setup tecnológico."}
            </p>

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
                  Garantía
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Truck size={18} className="mb-2 text-[#97cf00]" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                  Envíos
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <Wrench size={18} className="mb-2 text-[#97cf00]" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
                  Soporte
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-[#111111]/80 p-8">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Detalles del producto
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Categoría
              </p>
              <p className="mt-2 text-sm font-bold text-white">
                {product.category?.name ?? "Producto"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Stock
              </p>
              <p className="mt-2 text-sm font-bold text-white">
                {product.stock} unidades
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Código
              </p>
              <p className="mt-2 text-sm font-bold text-white">
                PCB-{String(product.id).padStart(5, "0")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}