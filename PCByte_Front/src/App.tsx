import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import type {
  CartItem,
  Product,
} from "./types/types";

import { useProducts } from "./hooks/useProducts";
import { useAuth } from "./hooks/useAuth";

// Componentes
import Navbar from "./components/layout/Navbar";
import Cart from "./components/Cart";
import AdminDashboard from "./components/AdminDashboard";
import SuccessPage from "./components/SuccessPage";
import WhatsAppWidget from "./components/WhatsAppWidget";

// Páginas
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CheckoutSelection from "./pages/CheckoutSelection";
import { CheckoutPage } from "./pages/ChecKoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const CART_KEY = "pcbyte_cart_v1";

function App() {
  const {
    products,
    loadingProducts,
  } = useProducts();

  const navigate = useNavigate();
  const location = useLocation();

  const {
    isAuthenticated,
    isLoadingAuth,
  } = useAuth();

  const [cart, setCart] =
    useState<CartItem[]>(() => {
      const savedCart =
        localStorage.getItem(CART_KEY);

      if (!savedCart) {
        return [];
      }

      try {
        const parsed =
          JSON.parse(savedCart);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch {
        return [];
      }
    });

  const [filter, setFilter] =
    useState("TODOS");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [sortBy, setSortBy] =
    useState("default");

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 12;

  /*
   * Corrige la posición inicial del catálogo
   * cuando se entra nuevamente a /productos.
   */
  useLayoutEffect(() => {
    if (
      location.pathname !==
      "/productos"
    ) {
      return;
    }

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop =
        0;
      document.body.scrollTop = 0;
    };

    resetScroll();

    const animationFrame =
      window.requestAnimationFrame(
        resetScroll
      );

    return () => {
      window.cancelAnimationFrame(
        animationFrame
      );
    };
  }, [location.pathname]);

  /*
   * Reinicia la paginación cuando cambia
   * un filtro, búsqueda u ordenamiento.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filter,
    searchTerm,
    sortBy,
  ]);

  /*
   * Mantiene el carrito almacenado
   * en el navegador.
   */
  useEffect(() => {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify(cart)
    );
  }, [cart]);

  const hideNavbarPaths = [
    "/",
    "/checkout",
    "/checkout-selection",
    "/success",
    "/login",
    "/register",
  ];

  const shouldHideNavbar =
    hideNavbarPaths.includes(
      location.pathname
    );

  const hideWhatsAppPaths = [
    "/checkout",
    "/checkout-selection",
    "/success",
    "/login",
    "/register",
  ];

  const shouldHideWhatsApp =
    hideWhatsAppPaths.includes(
      location.pathname
    );

  const addToCart = (
    product: Product
  ) => {
    if (product.stock <= 0) {
      return;
    }

    setCart((previousCart) => {
      const existingItem =
        previousCart.find(
          (item) =>
            item.product.id ===
            product.id
        );

      if (existingItem) {
        return previousCart.map(
          (item) => {
            if (
              item.product.id !==
              product.id
            ) {
              return item;
            }

            /*
             * Impide superar el stock
             * disponible del producto.
             */
            const nextQuantity =
              Math.min(
                item.quantity + 1,
                product.stock
              );

            return {
              ...item,
              quantity:
                nextQuantity,
            };
          }
        );
      }

      return [
        ...previousCart,
        {
          product,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (
    productId: number,
    delta: number
  ) => {
    setCart((previousCart) =>
      previousCart.map((item) => {
        if (
          item.product.id !==
          productId
        ) {
          return item;
        }

        const newQuantity =
          Math.min(
            item.product.stock,
            Math.max(
              1,
              item.quantity + delta
            )
          );

        return {
          ...item,
          quantity: newQuantity,
        };
      })
    );
  };

  const removeItem = (
    productId: number
  ) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) =>
          item.product.id !==
          productId
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(CART_KEY);
  };

  /*
   * Flujo oficial de compra:
   *
   * Autenticado:
   * carrito -> checkout
   *
   * No autenticado:
   * carrito -> checkout-selection
   */
  const handleCheckoutRedirection =
    () => {
      setIsCartOpen(false);

      if (isAuthenticated) {
        navigate("/checkout");
        return;
      }

      navigate(
        "/checkout-selection"
      );
    };

  const handleSearchChange = (
    value: string
  ) => {
    setSearchTerm(value);

    if (value.trim() !== "") {
      setFilter("TODOS");
    }
  };

  const processedProducts =
    useMemo(() => {
      return products
        .filter((product) => {
          const matchesSearch =
            product.name
              .toLowerCase()
              .includes(
                searchTerm.toLowerCase()
              );

          const categoryName =
            product.category?.name ??
            product.categoryName ??
            "";

          const matchesCategory =
            filter === "TODOS" ||
            categoryName.toUpperCase() ===
              filter.toUpperCase();

          return (
            matchesSearch &&
            matchesCategory
          );
        })
        .sort((a, b) => {
          if (
            a.stock === 0 &&
            b.stock > 0
          ) {
            return 1;
          }

          if (
            a.stock > 0 &&
            b.stock === 0
          ) {
            return -1;
          }

          if (
            sortBy === "price-asc"
          ) {
            return a.price - b.price;
          }

          if (
            sortBy === "price-desc"
          ) {
            return b.price - a.price;
          }

          return 0;
        });
    }, [
      products,
      searchTerm,
      filter,
      sortBy,
    ]);

  const totalPages =
    Math.ceil(
      processedProducts.length /
        productsPerPage
    ) || 1;

  const currentProducts =
    processedProducts.slice(
      (currentPage - 1) *
        productsPerPage,
      currentPage *
        productsPerPage
    );

  const cartTotal = cart.reduce(
    (accumulator, item) =>
      accumulator +
      item.product.price *
        item.quantity,
    0
  );

  const cartItemCount = cart.reduce(
    (accumulator, item) =>
      accumulator +
      item.quantity,
    0
  );

  if (isLoadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#97cf00]">
          Cargando PCByte...
        </p>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <AdminDashboard
        onLogout={() =>
          setIsAdmin(false)
        }
      />
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0a0a0a] font-sans text-white selection:bg-[#0066FF]/30">
      {!shouldHideNavbar && (
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={
            handleSearchChange
          }
          cartItemCount={
            cartItemCount
          }
          onOpenAdmin={() =>
            setIsAdmin(true)
          }
          onOpenCart={() =>
            setIsCartOpen(true)
          }
          onGoHome={() =>
            navigate("/")
          }
        />
      )}

      <div className="flex min-w-0 flex-1 w-full">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setFilter={setFilter}
                processedProducts={
                  processedProducts
                }
                onSelectProduct={(
                  product
                ) =>
                  navigate(
                    `/productos/${product.id}`
                  )
                }
                onAddToCart={
                  addToCart
                }
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
                currentProducts={
                  currentProducts
                }
                loadingProducts={
                  loadingProducts
                }
                totalProducts={
                  processedProducts.length
                }
                activeCategory={
                  filter
                }
                searchTerm={
                  searchTerm
                }
                currentPage={
                  currentPage
                }
                totalPages={
                  totalPages
                }
                setCurrentPage={
                  setCurrentPage
                }
                onSelectProduct={(
                  product
                ) =>
                  navigate(
                    `/productos/${product.id}`
                  )
                }
                onAddToCart={
                  addToCart
                }
              />
            }
          />

          <Route
            path="/productos/:id"
            element={
              <ProductDetail
                onAddToCart={
                  addToCart
                }
              />
            }
          />

          <Route
            path="/checkout-selection"
            element={
              isAuthenticated ? (
                <Navigate
                  to="/checkout"
                  replace
                />
              ) : (
                <CheckoutSelection
                  onGuestContinue={() =>
                    navigate(
                      "/checkout"
                    )
                  }
                  onLoginSuccess={() =>
                    navigate(
                      "/login",
                      {
                        state: {
                          from:
                            "/checkout",
                        },
                      }
                    )
                  }
                  onRegister={() =>
                    navigate(
                      "/register",
                      {
                        state: {
                          from:
                            "/checkout",
                        },
                      }
                    )
                  }
                  onBack={() =>
                    navigate(
                      "/productos"
                    )
                  }
                />
              )
            }
          />

          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />

          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                total={cartTotal}
                onBack={() => {
                  if (
                    isAuthenticated
                  ) {
                    navigate(
                      "/productos"
                    );
                    return;
                  }

                  navigate(
                    "/checkout-selection"
                  );
                }}
                clearCart={
                  clearCart
                }
              />
            }
          />

          <Route
            path="/success"
            element={
              <SuccessPage
                clearCart={
                  clearCart
                }
              />
            }
          />
        </Routes>
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() =>
              setIsCartOpen(false)
            }
          />

          <div className="relative h-full w-full max-w-md animate-in slide-in-from-right duration-300">
            <Cart
              cart={cart}
              onClose={() =>
                setIsCartOpen(false)
              }
              onRemove={
                removeItem
              }
              onUpdateQuantity={
                updateQuantity
              }
              onCheckout={
                handleCheckoutRedirection
              }
            />
          </div>
        </div>
      )}

      {!shouldHideWhatsApp && (
        <WhatsAppWidget />
      )}
    </div>
  );
}

export default App;