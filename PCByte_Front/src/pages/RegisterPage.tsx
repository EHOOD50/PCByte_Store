import React from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      {/* NAVBAR SIMPLIFICADO PARA REGISTRO */}
      <nav className="sticky top-0 z-40 bg-slate-900 border-b-2 border-[#97cf00] px-6 h-20 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-black italic tracking-tighter text-white uppercase hover:opacity-80 transition-opacity">
            PC<span className="text-[#0066FF]">BYTE</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#97cf00] transition-colors">
            Volver a la tienda
          </Link>
          <Link to="/login" className="bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20 transition-all border border-white/10">
            Ya tengo cuenta
          </Link>
        </div>
      </nav>

      {/* CUERPO CON FONDO */}
      <div 
        className="flex-1 flex items-center justify-center p-4 bg-cover bg-center relative"
        style={{ backgroundImage: `url('/fondo2.jpg')` }}
      >
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"></div>
        
        <div className="relative w-full max-w-4xl backdrop-blur-md bg-slate-900/40 p-4 md:p-8 rounded-[4rem] shadow-2xl border border-white/10">
          <RegisterForm onRegisterSuccess={() => navigate('/login')} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;