import type { Product } from "../../../types/types";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  return (
    <div className="rounded-[2.5rem] border border-white/10 bg-white p-8 shadow-2xl">
      <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] bg-slate-50 p-8">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="max-h-[340px] max-w-full object-contain transition-transform duration-500 hover:scale-105"
        />
      </div>
    </div>
  );
}