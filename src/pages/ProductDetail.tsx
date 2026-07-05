import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Package, Boxes, Hash } from "lucide-react";

import ProductGallery from "../components/product/detail/ProductGallery";
import ProductPurchasePanel from "../components/product/detail/ProductPurchasePanel";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/types";
import ProductTabs from "../components/product/detail/ProductTabs";

interface ProductDetailProps {
  onAddToCart: (product: Product) => void;
}

export default function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loadingProducts } = useProducts();
  const [activeTab, setActiveTab] = useState<"description" | "specs">("description");
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

        <section className="grid items-start gap-8 xl:grid-cols-[1fr_0.85fr]">
  <ProductGallery product={product} />

  <ProductPurchasePanel
    product={product}
    onAddToCart={onAddToCart}
  />
</section>

        <ProductTabs product={product} />
      </div>
    </main>
  );
}