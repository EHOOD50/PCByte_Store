import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useProducts } from "../../../hooks/useProducts";
import type { Product } from "../../../types/types";

import ProductCard from "../../ProductCard";

interface RelatedProductsProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function RelatedProducts({
  product,
  onAddToCart,
}: RelatedProductsProps) {
  const navigate = useNavigate();
  const { products } = useProducts();

  const relatedProducts = useMemo(() => {
    return products
      .filter(
        (p) =>
          p.id !== product.id &&
          p.category?.id === product.category?.id
      )
      .slice(0, 4);
  }, [products, product]);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-16">

      <div className="mb-8">

        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#97cf00]">
          Recomendados
        </p>

        <h2 className="mt-2 text-3xl font-black uppercase text-white">
          También te puede interesar
        </h2>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {relatedProducts.map((item) => (

          <div
            key={item.id}
            className="cursor-pointer"
            onClick={() => navigate(`/productos/${item.id}`)}
          >
            <ProductCard
              product={item}
              addToCart={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
            />
          </div>

        ))}

      </div>

    </section>
  );
}