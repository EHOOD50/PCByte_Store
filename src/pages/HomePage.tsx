import React from 'react';
import { Search, ShoppingCart, LogOut, Zap } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/Footer';
import WhatsAppWidget from '../components/WhatsAppWidget';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const HomePage = ({ 
  products, searchTerm, setSearchTerm, cart, setIsCartOpen, 
  filter, setFilter, currentPage, totalPages, setCurrentPage, addToCart, user 
}: any) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-white">
      {/* NAVBAR: Sincronizado con Checkout (h-20, px-6, border-[#97cf00]) */}
      <nav className="sticky top-0 z-40 bg-slate-900 border-b-2 border-[#97cf00] px-6 h-20 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-black italic tracking-tighter text-white uppercase">
            PC<span className="text-[#0066FF]">BYTE</span>
          </Link>
          
          {/* BOTÓN DISCRETO PARA EL ADMIN */}
          <button 
            onClick={() => navigate('/admin')}
            className="ml-4 p-2 text-slate-600 hover:text-[#97cf00] transition-colors"
            title="Mantenimiento de Sistema"
          >
            <Zap size={14} />
          </button>
        </div>

        {/* Buscador centralizado */}
        <div className="flex-1 flex justify-center px-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black outline-none focus:border-[#97cf00] text-white uppercase"
              placeholder="¿QUÉ PRODUCTO BUSCAS?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#97cf00]">
                ¡HOLA, {user.name?.split(' ')[0].toUpperCase()}!
              </span>
              <button 
                onClick={() => { authService.logout(); window.location.reload(); }} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-white">
              <Link to="/login" className="hover:text-[#97cf00] transition-colors self-center">Iniciar Sesión</Link>
              <Link to="/register" className="bg-[#0066FF] px-4 py-2 rounded-full hover:bg-[#97cf00] transition-all">Registrarse</Link>
            </div>
          )}

          <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-[#0066FF] rounded-xl hover:bg-[#97cf00] transition-all shadow-lg">
            <ShoppingCart size={22} className="text-white" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-slate-900 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                {cart.reduce((acc: number, item: any) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Cuerpo principal */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar con el nombre de prop corregido para evitar el error TS(2322) */}
        <Sidebar 
          activeCategory={filter} 
          onSelectCategory={setFilter} 
        />

        <main className="flex-1 p-8 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((p: any) => (
              <ProductCard key={p.id} product={p} addToCart={() => addToCart(p)} />
            ))}
          </div>
          
          {/* Paginación (opcional si lo manejas aquí) */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button 
                disabled={currentPage === 0} 
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <button 
                disabled={currentPage >= totalPages - 1} 
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-[#0066FF] text-white text-[10px] font-black uppercase rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
      <WhatsAppWidget />
    </div>
  );
};