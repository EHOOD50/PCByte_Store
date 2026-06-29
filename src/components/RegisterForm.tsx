import React, { useState } from 'react';
import { User, Mail, Lock, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

export const RegisterForm = ({ onRegisterSuccess }: { onRegisterSuccess: (user: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',     
    email: '',
    password: '',
    street: '',
    number: '',
    city: '',
    region: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const newUser = await authService.register(formData);
      onRegisterSuccess(newUser);
    } catch (err: any) {
      setError(err.response?.data || "Error al crear la cuenta. Intenta con otro email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-t-8 border-[#97cf00]">
      <div className="mb-8">
        <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
          Crear cuenta en <span className="text-[#0066FF]">PCBYTE</span>
        </h2>
        <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">
          Regístrate para una compra más rápida
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {error && (
          <div className="md:col-span-2 bg-red-50 text-red-500 text-[10px] font-bold p-3 rounded-xl border border-red-100 uppercase">
            {error}
          </div>
        )}

        {/* SECCIÓN CUENTA */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Datos de acceso</p>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input name="name" placeholder="NOMBRE COMPLETO" onChange={handleChange} required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900 text-sm" />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input name="email" type="email" placeholder="EMAIL" onChange={handleChange} required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900 text-sm" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input name="password" type="password" placeholder="CONTRASEÑA" onChange={handleChange} required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900 text-sm" />
          </div>
        </div>

        {/* SECCIÓN DESPACHO */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Dirección de despacho</p>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input name="street" placeholder="CALLE / AVENIDA" onChange={handleChange} required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900 text-sm" />
          </div>
          <div className="flex gap-2">
            <input name="number" placeholder="N°" onChange={handleChange} required
              className="w-1/3 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900 text-sm" />
            <input name="city" placeholder="CIUDAD" onChange={handleChange} required
              className="w-2/3 p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900 text-sm" />
          </div>
          <input name="region" placeholder="REGIÓN" onChange={handleChange} required
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900 text-sm" />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="md:col-span-2 w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic text-lg flex items-center justify-center gap-3 hover:bg-[#97cf00] transition-all group disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'CREAR MI CUENTA'}
          {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-[#0066FF]" />}
        </button>
      </form>
    </div>
  );
};