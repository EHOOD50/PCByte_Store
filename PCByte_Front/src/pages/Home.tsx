import type { Product } from "../types/types";

import WhyChoosePCByte from "../components/home/WhyChoosePCByte";

interface HomeProps {
  setFilter: (value: string) => void;
  processedProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

function Home({}: HomeProps) {
  return (
    <main className="flex-1 overflow-y-auto px-6 pb-12 pt-4 custom-scrollbar md:px-10 md:pt-6">
      <WhyChoosePCByte />
    </main>
  );
}

export default Home;