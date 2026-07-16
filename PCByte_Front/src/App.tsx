import { useEffect, useState, useMemo } from "react";

import type { Product,CartItem } from "./types/types";
import { useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import { useProducts } from "./hooks/useProducts";

// Componentes
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./components/Cart";
import ProductDetail from "./pages/ProductDetail";
import AdminDashboard from "./components/AdminDashboard";
import SuccessPage from "./components/SuccessPage";
import WhatsAppWidget from "./components/WhatsAppWidget";

// Páginas
import CheckoutSelection from './pages/CheckoutSelection';
import { CheckoutPage } from "./pages/ChecKoutPage";

// Iconos
import { ShieldCheck } from "lucide-react";

const CART_KEY = "pcbyte_cart_v1";

function App() {
  const { products, loadingProducts } = useProducts();
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
  const productsPerPage = 12;

  useEffect(() => {
  setCurrentPage(1);
}, [filter, searchTerm, sortBy]);

  // --- LÓGICA DE NAVBAR CONDICIONAL ---
  const hideNavbarPaths = [
  "/",
  "/checkout",
  "/checkout-selection",
  "/success",
];
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
        const productCategoryName =
  p.category?.name ?? p.categoryName ?? "";

const matchCategory =
  filter === "TODOS" ||
  productCategoryName.toUpperCase() === filter.toUpperCase();
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
const handleSearchChange = (value: string) => {
  setSearchTerm(value);

  if (value.trim() !== "") {
    setFilter("TODOS");
  }
};
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col selection:bg-[#0066FF]/30">
      
      {/* NAVBAR GLOBAL */}
      {!shouldHideNavbar && (
        <Navbar
          searchTerm={searchTerm}
           onSearchChange={handleSearchChange}
           cartItemCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
           onOpenAdmin={() => setIsAdmin(true)}
           onOpenCart={() => setIsCartOpen(true)}
            onGoHome={() => navigate("/")}
          />
        )}

      {/* RUTAS PRINCIPALES */}
      <div className="flex-1 flex">
        <Routes>
          {/* HOME PAGE INTEGRADO */}
          <Route
  path="/"
  element={
    <Home
      setFilter={setFilter}
      processedProducts={processedProducts}
      onSelectProduct={(product) => navigate(`/productos/${product.id}`)}
      onAddToCart={addToCart}
    />
  }
/>
      <Route
  path="/productos"
  element={
    <Products
      filter={filter}
      
      setFilter={setFilter}
      sortBy={sortBy}
      setSortBy={setSortBy}
      currentProducts={currentProducts}
      loadingProducts={loadingProducts}
      totalProducts={processedProducts.length}
      activeCategory={filter}
      searchTerm={searchTerm}
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
      onSelectProduct={(product) => navigate(`/productos/${product.id}`)}
      onAddToCart={addToCart}
    />
  }
/>
      <Route
        path="/productos/:id"
        element={<ProductDetail onAddToCart={addToCart} />}
      />
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

          <Route
  path="/success"
  element={
    <SuccessPage
      clearCart={clearCart}
    />
  }
/>
        </Routes>
      </div>

      {/* MODALES GLOBALES */}
      

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