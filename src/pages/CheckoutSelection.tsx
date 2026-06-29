import React from 'react';
import { User, ArrowRight, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';

interface CheckoutSelectionProps {
  onGuestContinue: () => void;
  onLoginSuccess: () => void;
  onBack: () => void;
}

export const CheckoutSelection = ({ onGuestContinue, onLoginSuccess, onBack }: CheckoutSelectionProps) => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col font-sans text-slate-900 overflow-hidden">
      
      {/* NAVBAR TRANSACCIONAL MINIMALISTA */}
      <nav className="h-[70px] bg-white border-b border-slate-100 px-6 flex justify-between items-center z-50 shrink-0">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase hover:text-slate-900 transition-all group"
        >
          <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-[#97cf00]/10 transition-colors">
            <ChevronLeft size={16} className="group-hover:text-[#97cf00]" />
          </div>
          Volver a la tienda
        </button>
        <h1 className="text-xl font-black italic tracking-tighter uppercase">
          PC<span className="text-[#0066FF]">BYTE</span>
        </h1>
        <div className="hidden md:flex items-center gap-2 text-slate-300">
          <ShieldCheck size={14} />
          <span className="text-[9px] font-black uppercase tracking-widest">Acceso Seguro</span>
        </div>
      </nav>

      {/* CONTENIDO CENTRAL */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50/50">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* OPCIÓN INVITADO */}
          <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center hover:border-[#97cf00] transition-all group">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-[#97cf00]/10 transition-colors">
              <Zap size={40} className="text-slate-300 group-hover:text-[#97cf00] transition-colors" />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Compra <span className="text-[#97cf00]">Rápida</span></h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide leading-relaxed mb-8">
              Continúa como invitado. No necesitas crear una cuenta para recibir tus productos.
            </p>
            <button 
              onClick={onGuestContinue}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-black active:scale-95 transition-all shadow-lg"
            >
              Continuar como Invitado <ArrowRight size={18} />
            </button>
          </div>

          {/* OPCIÓN LOGIN */}
          <div className="bg-slate-900 p-10 rounded-[2.5rem] border-2 border-slate-800 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <User size={120} className="text-white" />
            </div>
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-[#0066FF]/50 transition-all">
              <User size={40} className="text-[#0066FF]" />
            </div>
            <h2 className="text-white text-2xl font-black uppercase italic tracking-tighter mb-4">Soy <span className="text-[#0066FF]">Cliente</span></h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wide leading-relaxed mb-8">
              Inicia sesión para usar tus datos guardados y acumular puntos en tu compra.
            </p>
            <button 
              onClick={onLoginSuccess}
              className="w-full bg-[#0066FF] text-white py-5 rounded-2xl font-black uppercase italic text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-[#0052cc] active:scale-95 transition-all shadow-[0_0_30px_rgba(0,102,255,0.3)]"
            >
              Iniciar Sesión <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutSelection;