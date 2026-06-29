import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronRight, LayoutGrid, Activity, ShieldCheck } from 'lucide-react';

interface MenuGroup {
  id: number | string;
  title: string;
  color: string;
  cats: string[];
}

interface SidebarProps {
  activeCategory: string; // Añadido para resaltar el botón activo
  onSelectCategory: (categoryName: string) => void; // Nombre corregido para App.tsx
}

const API_BASE_URL = 'http://192.168.100.226:8080/api';

const Sidebar: React.FC<SidebarProps> = ({ activeCategory, onSelectCategory }) => {
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/config/menu`);
        if (response.data && response.data.configValue) {
          const parsedConfig = JSON.parse(response.data.configValue);
          setMenuGroups(Array.isArray(parsedConfig) ? parsedConfig : []);
        }
      } catch (error) {
        console.error("Error cargando configuración de menú:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleSelect = (cat: string) => {
    onSelectCategory(cat);
  };

  if (loading) {
    return (
      <aside className="w-72 hidden lg:flex flex-col gap-6">
        <div className="bg-[#111111]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 animate-pulse space-y-8">
          <div className="h-4 w-24 bg-white/10 rounded-full"></div>
          <div className="space-y-4">
            <div className="h-12 bg-white/5 rounded-2xl"></div>
            <div className="h-12 bg-white/5 rounded-2xl"></div>
            <div className="h-12 bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-72 hidden lg:flex flex-col gap-6 sticky top-10 h-[calc(100vh-120px)]">
      <div className="bg-[#111111]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 shadow-2xl flex flex-col h-full overflow-y-auto custom-scrollbar">
        
        {/* HEADER DEL SIDEBAR 
        <div className="flex items-center gap-3 mb-10 shrink-0">
          <div className="p-2 bg-[#97cf00]/10 rounded-lg">
            <Activity size={16} className="text-[#97cf00]" />
          </div>
          <div>
            <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] leading-none">
              Control_Panel
            </h2>
            <span className="text-[8px] font-mono text-[#97cf00]/60 uppercase">Sincronizado_DB</span>
          </div>
        </div>*/}

        {/* NAVEGACIÓN */}
        <nav className="flex flex-col gap-8">
          {/* BOTÓN "TODOS" */}
          <button
            onClick={() => handleSelect('TODOS')}
            className={`w-full group flex items-center gap-4 p-4 rounded-2xl transition-all duration-500
              ${activeCategory === 'TODOS' 
                ? 'bg-[#0066FF] text-white shadow-[0_15px_30px_rgba(0,102,255,0.25)]' 
                : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10'}`}
          >
            <LayoutGrid size={18} className={`${activeCategory === 'TODOS' ? 'scale-110' : 'group-hover:rotate-12'}`} />
            <span className="text-[11px] font-black uppercase tracking-widest flex-1 text-left">Mostrar Todo</span>
          </button>

          {/* GRUPOS DINÁMICOS */}
          {menuGroups.map((group) => (
            <div key={group.id} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 italic" style={{ color: group.color }}>
                  {group.title}
                </h3>
              </div>

              <div className="flex flex-col gap-1.5 pl-1">
                {group.cats?.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className={`group flex justify-between items-center px-4 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${
                      activeCategory === cat 
                      ? "bg-white/10 text-white translate-x-2 border-l-2" 
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                    }`}
                    style={{ borderLeftColor: activeCategory === cat ? group.color : 'transparent' }}
                  >
                    {cat}
                    <ChevronRight 
                      size={14} 
                      className={`transition-all duration-500 ${activeCategory === cat ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} 
                      style={{ color: group.color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER STATUS */}
        <div className="mt-auto pt-10 shrink-0">
          <div className="p-4 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col items-center">
            <ShieldCheck size={20} className="text-[#97cf00] mb-2 opacity-50" />
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter text-center">Core_Engine_v1.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;