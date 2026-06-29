import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../services/authService';

export const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: () => void }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Usamos el servicio que conecta con tu Java
      await authService.login(credentials.email, credentials.password);
      onLoginSuccess();
    } catch (err: any) {
      setError("Email o contraseña incorrectos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border-t-8 border-[#0066FF]">
      <div className="mb-8">
        <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
          Ingresar a <span className="text-[#0066FF]">PCBYTE</span>
        </h2>
        <p className="text-slate-400 text-[10px] font-black tracking-widest uppercase">Bienvenido de vuelta, Gamer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-500 text-[10px] font-bold p-3 rounded-xl border border-red-100 uppercase">
            {error}
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            name="email" type="email" placeholder="TU EMAIL" required
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900" 
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            name="password" type="password" placeholder="CONTRASEÑA" required
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#0066FF] font-bold text-slate-900" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic text-lg flex items-center justify-center gap-3 hover:bg-[#0066FF] transition-all group disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : 'INICIAR SESIÓN'}
          {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-[#97cf00]" />}
        </button>
      </form>
    </div>
  );
};