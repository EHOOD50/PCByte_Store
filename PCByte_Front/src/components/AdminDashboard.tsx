import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, Trash2, Edit3, LogOut, Cpu, X, 
  Search, Layout, ChevronRight, Save, Settings, Filter, MapPin, User, CheckCircle2, Clock
} from 'lucide-react';
import ProductManager from "./admin/ProductManager";
import adminApi from "../api/adminApi";


interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'menu-builder'>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [menuGroups, setMenuGroups] = useState(() => {
    const saved = localStorage.getItem('pcbyte_menu_config');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'COMPONENTES', color: '#0066FF', cats: [] },
      { id: 2, title: 'AUDIO & STREAMING', color: '#97cf00', cats: [] }
    ];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [formData, setFormData] = useState({
    id: null as number | null,
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: 1,
    imageUrl: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const resCat = await adminApi.get('/categories').catch(() => ({ data: [] }));
      const contentCat = resCat.data?._embedded?.categories || resCat.data || [];
      const cleanCats = Array.isArray(contentCat) ? contentCat : [];
      setCategories(cleanCats);

      if (cleanCats.length > 0 && !formData.id) {
        setFormData(prev => ({ ...prev, categoryId: cleanCats[0].id }));
      }

      const resConfig = await adminApi.get('/config/menu').catch(() => null);
      if (resConfig?.data?.configValue) {
        setMenuGroups(JSON.parse(resConfig.data.configValue));
      }

      const resOrders = await adminApi.get('/admin/orders').catch(() => ({ data: [] }));
      const contentOrders = resOrders.data?._embedded?.orders || resOrders.data?.content || resOrders.data || [];
      setOrders(Array.isArray(contentOrders) ? contentOrders : []);

      const resProd = await adminApi.get('/products?size=100').catch(() => ({ data: [] }));
      const contentProd = resProd.data?._embedded?.products || resProd.data?.content || resProd.data || [];
      setProducts(Array.isArray(contentProd) ? contentProd : []);

    } catch (error) {
      showToast("Error de sincronización");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus, selectedCategory, activeTab]);
  useEffect(() => { fetchData(); }, []);

  const filteredOrders = (orders || []).filter((o: any) => {
    const term = searchTerm.toLowerCase();
    return o.id?.toString().includes(term) || 
           (o.customerEmail || "").toLowerCase().includes(term) ||
           (o.fullName || "").toLowerCase().includes(term) ||
           (o.city || "").toLowerCase().includes(term) ||
           (o.paymentId || "").toString().toLowerCase().includes(term);
  }).filter(o => filterStatus === 'ALL' || o.status === filterStatus);

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const currentItems = activeTab === 'products' 
    ? filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) 
    : filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.max(1, Math.ceil((activeTab === 'products' ? filteredProducts.length : filteredOrders.length) / itemsPerPage));

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updateOrderStatus = async (id: number, status: string) => {
    try { 
      await adminApi.patch(`/admin/orders/${id}/status`, { status }); 
      showToast("Estado Actualizado"); 
      fetchData();
    } catch (e) { showToast("Error en cambio"); }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, category: { id: formData.categoryId } };
      if (formData.id) await adminApi.put(`/products/${formData.id}`, payload);
      else await adminApi.post('/products', payload);
      setShowProductModal(false); 
      fetchData();
      showToast("Guardado con éxito");
    } catch (error) { alert("Error al guardar"); }
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm("¿Eliminar hardware?")) {
      try { await adminApi.delete(`/products/${id}`); fetchData(); } catch (e) { showToast("Error"); }
    }
  };

  const saveMenuConfig = async (config: any) => {
    setMenuGroups(config);
    try {
      await adminApi.post('/config/menu', { configKey: "MAIN_MENU", configValue: JSON.stringify(config) });
      localStorage.setItem('pcbyte_menu_config', JSON.stringify(config));
      showToast("UI Sincronizada");
    } catch (e) { showToast("Error al guardar menú"); }
  };

  const addCatToGroup = (groupId: number, catName: string) => {
    const updated = menuGroups.map((g: any) => (g.id === groupId && !g.cats.includes(catName)) ? { ...g, cats: [...g.cats, catName] } : g);
    saveMenuConfig(updated);
  };

  const removeCatFromGroup = (groupId: number, catName: string) => {
    const updated = menuGroups.map((g: any) => (g.id === groupId) ? { ...g, cats: g.cats.filter((c: string) => c !== catName) } : g);
    saveMenuConfig(updated);
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <Cpu className="animate-spin text-[#97cf00] mb-4" size={48} />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accediendo al Core...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {notification && <div className="fixed top-24 right-4 z-[200] bg-slate-900 text-[#97cf00] px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-2xl border-b-4 border-[#97cf00] animate-in slide-in-from-right">{notification}</div>}

      <nav className="sticky top-0 z-50 bg-slate-900 border-b-2 border-[#97cf00] px-6 h-20 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">PC<span className="text-[#0066FF]">BYTE</span><span className="ml-2 text-[10px] not-italic font-black text-[#97cf00] bg-[#97cf00]/10 px-2 py-1 rounded-md border border-[#97cf00]/20">Admin</span></h1>
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
            <button onClick={() => {setActiveTab('products'); setCurrentPage(1);}} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'products' ? 'bg-[#0066FF] text-white' : 'text-slate-400'}`}>Inventario</button>
            <button onClick={() => {setActiveTab('orders'); setCurrentPage(1);}} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'orders' ? 'bg-[#0066FF] text-white' : 'text-slate-400'}`}>Logística</button>
            <button onClick={() => {setActiveTab('menu-builder'); setCurrentPage(1);}} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'menu-builder' ? 'bg-[#97cf00] text-black' : 'text-slate-400'}`}><Layout size={14} /> Arquitectura</button>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase hover:bg-red-500 hover:text-white transition-all"><LogOut size={16}/></button>
      </nav>

      <main className="max-w-7xl mx-auto p-10">
        
        {/* --- INVENTARIO --- */}

        {activeTab === "products" && <ProductManager />}

       {/*  {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-black italic uppercase border-l-4 border-[#97cf00] pl-3">Gestión de Inventario</h2>
               <div className="flex gap-2">
                 <button onClick={() => setShowCategoryModal(true)} className="bg-slate-900 text-[#97cf00] px-5 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 group">
                   <Settings size={18} className="transition-transform duration-300 group-hover:rotate-180" />
                   Categorías
                 </button>
                 <button 
                  onClick={() => { 
                    setFormData({ id: null, name: '', description: '', price: 0, stock: 0, categoryId: categories.length > 0 ? categories[0].id : 0, imageUrl: '' }); 
                    setShowProductModal(true); 
                  }} 
                  className="bg-[#0066FF] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:bg-[#97cf00] hover:text-black transition-all shadow-lg"
                >
                  <Plus size={18}/> Nuevo Producto
                </button>
               </div>
            </div>
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  <tr><th className="p-6">Producto</th><th className="p-6">Categoria</th><th className="p-6">Stock</th><th className="p-6">Precio</th><th className="p-6 text-right">Gestión</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentItems.map((p: any) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 flex items-center gap-4">
                        <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover bg-slate-100" />
                        <div><p className="font-black text-xs uppercase">{p.name}</p><p className="text-[9px] text-slate-400 font-bold uppercase">REF: {p.id}</p></div>
                      </td>
                      <td className="p-6 font-black text-[10px] uppercase text-slate-500">{p.category?.name}</td>
                      <td className="p-6 font-black text-xs">{p.stock}</td>
                      <td className="p-6 font-black text-xs text-[#0066FF]">${p.price.toLocaleString('es-CL')}</td>
                      <td className="p-6 text-right">
                        <button onClick={() => {setFormData({...p, categoryId: p.category?.id}); setShowProductModal(true);}} className="p-2 text-slate-400 hover:text-blue-500"><Edit3 size={18}/></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )} */}

        {/* --- LOGÍSTICA (AHORA DENTRO DE SU activeTab CORRESPONDIENTE) --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
             <h2 className="text-xl font-black italic uppercase border-l-4 border-[#0066FF] pl-3">Logística de Despacho</h2>
             <div className="flex flex-col gap-4">
                {currentItems.map((o: any) => (
                  <div key={o.id} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 shadow-sm hover:border-[#0066FF]/30 transition-all">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* 1. ID Y PAGO */}
                      <div className="flex flex-col min-w-[140px] border-r-2 border-slate-50 pr-4">
                        <span className="text-3xl font-black text-[#0066FF] tracking-tighter italic">#{o.id}</span>
                        <div className="mt-2">
                          <span className={`text-[9px] font-black px-2 py-1.5 rounded-lg uppercase border-2 block text-center ${o.paymentId ? 'bg-[#97cf00]/10 border-[#97cf00] text-[#97cf00]' : 'bg-red-500/10 border-red-500 text-red-600'}`}>
                            {o.paymentId ? 'PAGADO' : 'PENDIENTE'}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase">ID: {o.paymentId || 'MANUAL'}</span>
                      </div>

                      {/* 2. CLIENTE Y DIRECCIÓN */}
                      <div className="flex-[2] space-y-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black uppercase text-slate-900">{o.fullName || 'Sin Nombre'}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${o.userId ? 'bg-purple-100 text-purple-600 border border-purple-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                              {o.userId ? '• REGISTRADO' : '• INVITADO'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#0066FF]">
                            <span className="text-[11px] font-black underline decoration-2 underline-offset-2">
                              {o.customerEmail || o.email || "email_no_disponible@pcbyte.cl"}
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-5 border-l-4 border-slate-900">
                          <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-slate-400 mt-1" />
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destino de Entrega</span>
                              <span className="text-sm font-black text-slate-800 uppercase leading-tight">
                                {o.street} {o.number} {o.extraInfo ? `• ${o.extraInfo}` : ''} {o.apartment ? `• DEPTO ${o.apartment}` : ''}
                              </span>
                              <span className="text-xs font-black text-[#0066FF] uppercase mt-1">
                                {o.city}, {o.region}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 3. PRODUCTOS */}
                      <div className="flex-1 border-l-2 border-slate-50 pl-6">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Hardware:</span>
                        <div className="space-y-1">
                          {o.orderItems?.map((item: any, idx: number) => (
                            <div key={idx} className="text-[10px] font-black text-slate-600 uppercase">
                              • {item.quantity}x {item.productName || item.product?.name || "Producto"}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4. TOTAL Y STATUS */}
                      <div className="flex flex-col items-end justify-between min-w-[200px]">
                        <div className="text-right">
                          <span className="text-2xl font-black text-slate-900 tracking-tighter">${o.total?.toLocaleString('es-CL')}</span>
                        </div>
                        <div className="w-full">
                          <label className="text-[9px] font-black text-slate-400 uppercase block mb-1 text-right">Estado del Envío:</label>
                          <div className="relative">
                            <select 
                              className={`w-full appearance-none font-black text-[11px] pl-4 pr-10 py-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                o.status === 'ENTREGADO' ? 'bg-[#97cf00] border-[#97cf00] text-white' : 'bg-slate-900 border-slate-900 text-white'
                              }`}
                              value={o.status} 
                              onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            >
                              <option value="PENDIENTE">PENDIENTE</option>
                              <option value="PAGADO">PAGADO</option>
                              <option value="ENVIADO">ENVIADO</option>
                              <option value="ENTREGADO">ENTREGADO</option>
                            </select>
                            <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-white/50 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* --- ARQUITECTURA --- */}
        {activeTab === 'menu-builder' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black italic uppercase border-l-4 border-[#0066FF] pl-3">Arquitectura del Menú</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Haz clic en los títulos para renombrar los grupos</p>
              </div>
              <button onClick={() => saveMenuConfig(menuGroups)} className="bg-[#97cf00] text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-lg">
                <Save size={18}/> Sincronizar UI
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {menuGroups.map((group: any) => (
                <div key={group.id} className="bg-white rounded-[3rem] p-8 border-2 border-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-8 rounded-full" style={{ backgroundColor: group.color }}></div>
                      {editingGroupId === group.id ? (
                        <input autoFocus className="font-black italic text-lg uppercase tracking-tighter outline-none border-b-2 border-[#0066FF] bg-slate-50 px-2" value={group.title} onChange={(e) => {
                            const updated = menuGroups.map((g: any) => g.id === group.id ? {...g, title: e.target.value} : g);
                            setMenuGroups(updated);
                          }} onBlur={() => setEditingGroupId(null)} onKeyDown={(e) => e.key === 'Enter' && setEditingGroupId(null)} />
                      ) : (
                        <h3 onClick={() => setEditingGroupId(group.id)} className="font-black italic text-lg uppercase tracking-tighter cursor-pointer hover:text-[#0066FF] flex items-center gap-2 group">
                          {group.title} <Edit3 size={14} className="opacity-0 group-hover:opacity-100 text-slate-300" />
                        </h3>
                      )}
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 bg-slate-100 rounded-full">{group.cats.length} CATEGORÍAS</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-8 min-h-[100px] p-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    {group.cats.map((cat: string) => (
                      <div key={cat} className="flex items-center gap-2 bg-white border-2 border-slate-100 px-4 py-2 rounded-xl group shadow-sm">
                        <span className="text-[10px] font-black uppercase">{cat}</span>
                        <button onClick={() => removeCatFromGroup(group.id, cat)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Asignar categoría:</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.filter((c: any) => !group.cats.includes(c.name)).map((c: any) => (
                        <button key={c.id} onClick={() => addCatToGroup(group.id, c.name)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-lg text-[9px] font-black uppercase transition-all">+ {c.name}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PAGINACIÓN --- */}
        {activeTab !== 'menu-builder' && (
          <div className="mt-10 flex justify-between items-center bg-white p-4 rounded-[2rem] border-2 border-slate-50 shadow-sm">
            <p className="text-[9px] font-black uppercase text-slate-400 ml-6">Página {currentPage} de {totalPages}</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase disabled:opacity-30 hover:bg-slate-50">Anterior</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase disabled:opacity-30">Siguiente</button>
            </div>
          </div>
        )}

      </main>

      {/* --- MODALES --- */}
      {showProductModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border-b-8 border-[#97cf00]">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">{formData.id ? 'Actualizar Producto' : 'Nuevo Ingreso'}</h3>
              <button onClick={() => setShowProductModal(false)} className="p-2 bg-white rounded-full text-red-500 shadow-sm"><X size={20}/></button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 ml-1 block">Modelo / Nombre</label><input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none border-2 border-transparent focus:border-[#0066FF] transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: NVIDIA RTX 4090" required /></div>
                <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 ml-1 block">Categoría</label><select className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none appearance-none cursor-pointer" value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: Number(e.target.value)})} required>{categories.map((c: any) => (<option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>))}</select></div>
                <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 ml-1 block">Especificaciones</label><textarea className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm outline-none min-h-[100px] resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} /></div>
                <div><label className="text-[9px] font-black uppercase text-slate-400 ml-1 block">Precio ($)</label><input type="number" className="w-full bg-slate-50 p-4 rounded-2xl font-black text-sm" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} /></div>
                <div><label className="text-[9px] font-black uppercase text-slate-400 ml-1 block">Stock</label><input type="number" className="w-full bg-slate-50 p-4 rounded-2xl font-black text-sm" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} /></div>
                <div className="col-span-2"><label className="text-[9px] font-black uppercase text-slate-400 ml-1 block">Imagen URL</label><input type="text" className="w-full bg-slate-50 p-4 rounded-2xl font-bold text-sm" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} /></div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-[#97cf00] py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#0066FF] hover:text-white transition-all">Sincronizar con el Core</button>
            </form>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50"><h3 className="text-xl font-black uppercase italic">Categorías</h3><button onClick={() => setShowCategoryModal(false)} className="text-slate-400"><X size={20}/></button></div>
            <div className="p-8 space-y-6">
              <div className="flex gap-2">
                <input type="text" placeholder="NUEVA..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="flex-1 bg-slate-50 border p-4 rounded-2xl font-black text-xs uppercase" />
                <button onClick={async () => {
                   if (!newCategoryName.trim()) return;
                   await adminApi.post('/categories', { name: newCategoryName });
                   setNewCategoryName('');
                   fetchData();
                   showToast("Categoría Creada");
                }} className="bg-slate-900 text-[#97cf00] px-6 rounded-2xl font-black text-[10px] uppercase">Añadir</button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {categories.map((c: any) => (
                  <div key={c.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <span className="font-black text-xs uppercase">{c.name}</span>
                    <button onClick={() => { if(window.confirm("¿Eliminar?")) adminApi.delete(`/categories/${c.id}`).then(()=>fetchData()) }} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;