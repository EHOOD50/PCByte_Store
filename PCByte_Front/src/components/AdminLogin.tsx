import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      onLoginSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <div className={`bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300 border-[0.5px] border-slate-200 ${error ? 'animate-shake border-red-500' : 'hover:border-[#97cf00]'}`}>
        
        <div className="relative h-32 bg-slate-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#97cf00_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="relative flex flex-col items-center">
            <div className="w-12 h-12 bg-[#97cf00] rounded-2xl flex items-center justify-center shadow-lg shadow-[#97cf00]/20 mb-2">
              <ShieldCheck size={24} className="text-slate-900" />
            </div>
            <h2 className="text-white font-black uppercase italic tracking-tighter text-xl">
              Acceso <span className="text-[#0066FF]">Core</span>
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Identificador</label>
              <div className="relative mt-1">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0066FF] transition-colors" size={16} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border-[0.5px] border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:bg-white focus:border-[#0066FF] transition-all"
                  placeholder="Usuario admin"
                />
              </div>
            </div>

            <div className="relative group">
              <label className="text-[9px] font-black uppercase text-slate-400 ml-1 tracking-widest">Código de Seguridad</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#97cf00] transition-colors" size={16} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-[0.5px] border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:bg-white focus:border-[#97cf00] transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-[10px] font-black text-red-500 uppercase text-center animate-bounce">
              Credenciales Inválidas - Acceso Denegado
            </p>
          )}

          <button 
            type="submit"
            className="w-full py-5 bg-[#0066FF] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-[#97cf00] hover:text-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            Autenticar Sistema
          </button>

          <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">
            ASTHOOD SECURITY PROTOCOL v1.0
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;