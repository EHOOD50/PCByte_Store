import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { type CartItem } from '../types/types';

interface CartProps {
  cart: CartItem[];
  onClose: () => void;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, onClose, onRemove, onUpdateQuantity, onCheckout }) => {
  
  // Cálculo del total seguro
  const total = React.useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item?.product?.price || 0;
      const qty = item?.quantity || 0;
      return acc + (price * qty);
    }, 0);
  }, [cart]);

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 shadow-2xl">
      {/* HEADER */}
      <div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#97cf00] rounded-lg text-slate-900">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest">Tu_Buffer</h2>
            <p className="text-[10px] font-mono text-[#97cf00] uppercase italic">Encrypted_Session</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {!cart || cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
            <ShoppingBag size={48} strokeWidth={1} />
            <p className="text-[10px] font-black uppercase tracking-widest">Sin datos en el buffer</p>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div key={item?.product?.id || index} className="flex gap-4 group">
                <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 shrink-0 border border-slate-100">
                  <img 
                    src={item?.product?.imageUrl || ''} 
                    alt={item?.product?.name || 'Producto'} 
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-black uppercase leading-tight line-clamp-2">
                      {item?.product?.name || 'Módulo Desconocido'}
                    </h3>
                    <p className="text-[11px] font-bold text-[#0066FF] mt-1">
                      ${(item?.product?.price || 0).toLocaleString('es-CL')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-2 py-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-0.5 hover:text-[#0066FF]"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-[10px] font-black w-3 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-0.5 hover:text-[#0066FF]"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemove(item.product.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER - TOTAL Y BOTÓN DE PAGO */}
      {cart && cart.length > 0 && (
        <div className="p-8 border-t bg-slate-50 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total_Buffer</p>
              <p className="text-3xl font-black text-slate-900 italic">
                ${(total || 0).toLocaleString('es-CL')}
              </p>
            </div>
            <div className="text-[9px] font-bold text-[#97cf00] uppercase tracking-tighter">
              Neto + IVA
            </div>
          </div>

          <button 
            onClick={onCheckout}
            className="w-full bg-[#0066FF] hover:bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs transition-all shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 active:scale-95 group"
          >
            <CreditCard size={18} />
            Ejecutar Orden de Compra
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;