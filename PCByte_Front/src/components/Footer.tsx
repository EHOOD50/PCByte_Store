import React from 'react';
import { Mail, Clock } from "lucide-react"; // Corregido: lucide-react

const Footer = () => (
  <footer className="bg-slate-900 border-t-4 border-[#97cf00] pt-16 pb-8 px-6 text-white shrink-0">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="space-y-4">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">PC<span className="text-[#0066FF]">BYTE</span></h2>
        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">Especialistas en productos informáticos. Somos Tecnología a tu alcance.</p>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#97cf00]">Soporte Técnico</h4>
        <ul className="space-y-3 text-sm font-bold">
          <li className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
            <Mail size={16} className="text-[#0066FF]"/> contacto@pcbyte.cl
          </li>
          <li className="flex items-center gap-3 text-slate-300">
            <Clock size={16} className="text-[#0066FF]"/> Lun - Vie | 09:00 - 18:00
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#97cf00]">Pagos Seguros</h4>
        <div className="flex gap-2 text-white">
          <div className="bg-white/10 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">Mercado Pago</div>
          <div className="bg-white/10 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest">WebPay</div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex justify-between items-center">
      <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">© 2026 PCBYTE CHILE</p>
      <span className="text-[9px] font-black text-[#97cf00] uppercase tracking-widest bg-[#97cf00]/5 px-2 py-1 rounded">Hardening v1.0 Activo</span>
    </div>
  </footer>
);

export default Footer;