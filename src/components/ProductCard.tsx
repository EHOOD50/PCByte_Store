import React from 'react';
import type { Product } from '../types/types';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  addToCart: (e: React.MouseEvent) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  return (
    /* Se usa border-[0.5px] y un color más suave para que la línea casi desaparezca hasta el hover */
    <div className="bg-white rounded-[24px] p-4 border-[0.5px] border-slate-100 shadow-sm transition-all duration-300 group flex flex-col h-full hover:border-[#97cf00] hover:ring-[3px] hover:ring-[#97cf00]/20 hover:shadow-[0_0_15px_rgba(151,207,0,0.2)]">
      <div className="relative aspect-square mb-4 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-4">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">
            Últimas {product.stock}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1">
        <span className="text-[9px] font-black text-[#0066FF] uppercase tracking-widest mb-1">
          {product.category?.name}
        </span>
        <h3 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
  {product.name}
</h3>
        
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-1 mb-4">
            <span className="text-lg font-black text-slate-900">
              ${product.price.toLocaleString('es-CL')}
            </span>
          </div>

          {/* BOTÓN CON INTERACCIÓN AZUL -> VERDE PC FACTORY */}
          <button
            onClick={addToCart}
            disabled={product.stock === 0}
            className={`w-full py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all duration-300 shadow-lg 
              ${product.stock === 0 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-[#0066FF] text-white hover:bg-[#97cf00] hover:text-slate-900 hover:scale-105 active:scale-95 shadow-blue-500/20 hover:shadow-[#97cf00]/30"
              }`}
          >
            {product.stock === 0 ? "Sin Stock" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;