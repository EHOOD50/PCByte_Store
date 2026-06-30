import FeaturedProducts from "../components/home/FeaturedProducts";
import type { Product } from "../types/types";
import TechnicalService from "../components/home/TechnicalService";
import Hero from "../components/home/Hero";
import WhyChoosePCByte from "../components/home/WhyChoosePCByte";

interface HomeProps {
  setFilter: (value: string) => void;
  processedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

function Home({
  setFilter,
  processedProducts,
  onSelectProduct,
  onAddToCart,
}: HomeProps) {
  return (
    <main className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-20">
      <Hero onSelectCategory={setFilter} />

      <WhyChoosePCByte />

      <FeaturedProducts
        products={processedProducts}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
      />

      <TechnicalService />
    </main>
  );
}

export default Home;