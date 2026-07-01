import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FeaturedProducts from "../components/home/FeaturedProducts";
import type { Product } from "../types/types";
import TechnicalService from "../components/home/TechnicalService";
import Hero from "../components/home/Hero";
import WhyChoosePCByte from "../components/home/WhyChoosePCByte";
import DiagnosticRequestModal from "../components/home/DiagnosticRequestModal";

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
  const navigate = useNavigate();
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  const handleViewProducts = () => {
    setFilter("TODOS");
    navigate("/productos");
  };

  const handleOpenDiagnostic = () => {
    setIsDiagnosticOpen(true);
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-20">
        <Hero
          onViewProducts={handleViewProducts}
          onRequestDiagnostic={handleOpenDiagnostic}
        />

        <WhyChoosePCByte />

        <FeaturedProducts
          products={processedProducts}
          onSelectProduct={onSelectProduct}
          onAddToCart={onAddToCart}
        />

        <TechnicalService onRequestDiagnostic={handleOpenDiagnostic} />
      </main>

      <DiagnosticRequestModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />
    </>
  );
}

export default Home;