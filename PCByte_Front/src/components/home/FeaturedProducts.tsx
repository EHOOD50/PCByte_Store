import type { Product } from "../../types/types";
import ProductCard from "../ProductCard";

interface FeaturedProductsProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export default function FeaturedProducts({
  products,
  onSelectProduct,
  onAddToCart,
}: FeaturedProductsProps) {
  const featured = products.slice(0, 8);

  return (
    <section className="my-16">
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#97cf00]">
          Destacados
        </p>

        <h2 className="mt-2 text-3xl font-black uppercase text-white">
          Productos destacados
        </h2>

        <p className="mt-3 text-slate-400 max-w-2xl">
          Una selección de equipos y accesorios recomendados por PCByte.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {featured.map((product) => (
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
    </section>
  );
}