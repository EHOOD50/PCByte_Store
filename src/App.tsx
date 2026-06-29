import { useEffect, useState, useMemo } from "react";

import type { Product, CartItem } from "./types/types";
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import { useProducts } from "./hooks/useProducts";

// Componentes
import Navbar from "./components/layout/Navbar";
import Hero from "./components/home/Hero";
import WhyChoosePCByte from "./components/home/WhyChoosePCByte";

import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";

import Sidebar from "./components/layout/Sidebar";
import AdminDashboard from "./components/AdminDashboard";
import SuccessPage from "./components/SuccessPage";
import WhatsAppWidget from "./components/WhatsAppWidget";

// Páginas
import CheckoutSelection from './pages/CheckoutSelection';
import { CheckoutPage } from "./pages/ChecKoutPage";

// Iconos
import { ArrowUpDown,ShieldCheck, Activity, X } from "lucide-react";

const CART_KEY = "pcbyte_cart_v1";

function App() {
  const { products } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  // --- ESTADOS ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) { return []; }
    }
    return [];
  });

  const [filter, setFilter] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default"); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsPerPage = 12;

  // --- LÓGICA DE NAVBAR CONDICIONAL ---
  const hideNavbarPaths = ["/checkout", "/checkout-selection"];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  

  // 2. PERSISTENCIA
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // 3. LÓGICA CARRITO
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  const handleCheckoutRedirection = () => {
    setIsCartOpen(false);
    const userToken = localStorage.getItem("user_token");
    if (userToken) navigate("/checkout");
    else navigate("/checkout-selection");
  };

  // 4. PROCESAMIENTO
  const processedProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = filter === "TODOS" || p.category?.name?.toUpperCase() === filter.toUpperCase();
        return matchSearch && matchCategory;
      })
      .sort((a, b) => {
        if (a.stock === 0 && b.stock > 0) return 1;
        if (a.stock > 0 && b.stock === 0) return -1;
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [products, searchTerm, filter, sortBy]);

  const totalPages = Math.ceil(processedProducts.length / productsPerPage) || 1;
  const currentProducts = processedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  if (isAdmin) return <AdminDashboard onLogout={() => setIsAdmin(false)} />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col selection:bg-[#0066FF]/30">
      
      {/* NAVBAR GLOBAL */}
      {!shouldHideNavbar && (
        <Navbar
          searchTerm={searchTerm}
           onSearchChange={setSearchTerm}
           cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
           onOpenAdmin={() => setIsAdmin(true)}
           onOpenCart={() => setIsCartOpen(true)}
            onGoHome={() => navigate("/")}
          />
        )}

      {/* RUTAS PRINCIPALES */}
      <div className="flex-1 flex overflow-hidden">
        <Routes>
          {/* HOME PAGE INTEGRADO */}
          <Route path="/" element={
            <>
              <Sidebar activeCategory={filter} onSelectCategory={setFilter} />
              <main className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-20">
                  <Hero onSelectCategory={setFilter} />
                  <WhyChoosePCByte />
                  <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-[#97cf00]" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      Productos encontrados: {processedProducts.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                    <ArrowUpDown size={14} className="text-[#0066FF]" />
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-[10px] font-black uppercase outline-none bg-transparent cursor-pointer text-white">
                      <option className="bg-slate-900" value="default">Relevancia</option>
                      <option className="bg-slate-900" value="price-asc">Precio: Menor a Mayor</option>
                      <option className="bg-slate-900" value="price-desc">Precio: Mayor a Menor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map(p => (
                    <div key={p.id} onClick={() => setSelectedProduct(p)} className="cursor-pointer">
                      <ProductCard product={p} addToCart={(e: any) => { e.stopPropagation(); addToCart(p); }} />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-6 mt-12">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase disabled:opacity-20 hover:border-[#97cf00]">Back</button>
                    <span className="text-[10px] font-black uppercase text-slate-500">Pág {currentPage} / {totalPages}</span>
                    <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-6 py-2 bg-[#0066FF] text-white rounded-xl font-black text-[10px] uppercase disabled:opacity-20 hover:bg-[#97cf00]">Next</button>
                  </div>
                )}
              </main>
            </>
          } />

          {/* CHECKOUT SELECTION (Con Navbar Oscuro y Ancho sincronizado) */}
          <Route path="/checkout-selection" element={
            <div className="flex-1 flex flex-col bg-[#050505]">
              <nav className="bg-slate-900 border-b-2 border-[#97cf00] px-6 h-20 flex justify-between items-center shadow-2xl shrink-0">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
                  <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                    PC<span className="text-[#0066FF]">BYTE</span>
                  </h1>
                </div>
                <div className="text-[#97cf00] flex items-center gap-2">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Secure_Selection</span>
                </div>
              </nav>
              <div className="flex-1 flex items-center justify-center p-8">
                <CheckoutSelection 
                  onGuestContinue={() => navigate("/checkout")}
                  onLoginSuccess={() => navigate("/checkout")}
                  onBack={() => navigate("/")}
                />
              </div>
            </div>
          } />

          {/* CHECKOUT PAGE (Prop clearCart pasada) */}
          <Route 
            path="/checkout" 
            element={
              <CheckoutPage 
                cart={cart} 
                total={cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0)} 
                onBack={() => navigate("/checkout-selection")} 
                clearCart={clearCart}
              />
            } 
          />

          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </div>

      {/* MODALES GLOBALES */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[150] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row relative shadow-2xl border-4 border-[#97cf00]/20 text-slate-900 animate-in fade-in zoom-in">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-slate-400 p-2 bg-slate-100 rounded-full hover:text-red-500 transition-all z-10"><X size={24} /></button>
            <div className="md:w-1/2 bg-slate-50 flex items-center justify-center p-12">
              <img src={selectedProduct.imageUrl} className="max-w-full max-h-100 object-contain drop-shadow-2xl" alt={selectedProduct.name} />
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-center">
              <span className="text-[#0066FF] font-black text-[10px] uppercase mb-2">{selectedProduct.category?.name}</span>
              <h2 className="text-4xl font-black mb-4 italic uppercase leading-none">{selectedProduct.name}</h2>
              <p className="text-slate-500 text-sm mb-8 border-l-4 border-[#97cf00] pl-4">{selectedProduct.description}</p>
              <div className="text-5xl font-black mb-8">${selectedProduct.price.toLocaleString('es-CL')}</div>
              <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full py-5 rounded-2xl bg-[#0066FF] text-white font-black uppercase text-sm shadow-xl hover:bg-[#97cf00] hover:text-black transition-all active:scale-95">Add to Buffer</button>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md h-full animate-in slide-in-from-right duration-300">
            <Cart 
              cart={cart} 
              onClose={() => setIsCartOpen(false)} 
              onRemove={removeItem} 
              onUpdateQuantity={updateQuantity} 
              onCheckout={handleCheckoutRedirection} 
            />
          </div>
        </div>
      )}
      
      <WhatsAppWidget />
    </div>
  );
}

export default App;