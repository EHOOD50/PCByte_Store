import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Product } from "../types/types";
import Hero from "../components/home/Hero";
import WhyChoosePCByte from "../components/home/WhyChoosePCByte";
import DiagnosticRequestModal from "../components/home/DiagnosticRequestModal";

interface HomeProps {
  setFilter: (value: string) => void;
  processedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

function Home({ setFilter }: HomeProps) {
  const navigate = useNavigate();
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);

  const handleViewProducts = () => {
    setFilter("TODOS");
    navigate("/productos");
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto px-6 pt-4 pb-12 custom-scrollbar md:px-10 md:pt-6">
        <Hero
          onViewProducts={handleViewProducts}
          onRequestDiagnostic={() => setIsDiagnosticOpen(true)}
        />

        <WhyChoosePCByte />
      </main>

      <DiagnosticRequestModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />
    </>
  );
}

export default Home;