import React from "react";
import { Plus, Settings } from "lucide-react";

interface ProductToolbarProps {
  onNewProduct: () => void;
  onManageCategories: () => void;
}

const ProductToolbar: React.FC<ProductToolbarProps> = ({
  onNewProduct,
  onManageCategories,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-black italic uppercase border-l-4 border-[#97cf00] pl-3">
        Gestión de Inventario
      </h2>

      <div className="flex gap-2">
        <button
          onClick={onManageCategories}
          className="bg-slate-900 text-[#97cf00] px-5 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2"
        >
          <Settings size={18} />
          Categorías
        </button>

        <button
          onClick={onNewProduct}
          className="bg-[#0066FF] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>
    </div>
  );
};

export default ProductToolbar;