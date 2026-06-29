import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* NAVBAR UNIFICADO */}
      <nav className="sticky top-0 z-40 bg-slate-900 border-b-2 border-[#97cf00] px-6 h-20 flex justify-between items-center shadow-xl">
        <Link to="/" className="text-2xl font-black italic tracking-tighter text-white uppercase">
          PC<span className="text-[#0066FF]">BYTE</span>
        </Link>
        <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#97cf00] transition-colors">
          Volver a la tienda
        </Link>
      </nav>

      <div 
        className="flex-1 flex items-center justify-center p-4 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/assets/images/fondo2.jpg')` }}
      >
        {/* Capa de contraste sin desenfoque */}
        <div className="absolute inset-0 bg-slate-950/30"></div>
        
        <div className="relative w-full max-w-md bg-slate-900/60 p-4 rounded-[3rem] shadow-2xl border border-white/10">
          <LoginForm onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;