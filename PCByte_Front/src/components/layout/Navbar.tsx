import {
  useEffect,
  useRef,
  useState,
} from "react";

import logo from "../../assets/logo.png";

import {
  ChevronDown,
  Home,
  Laptop,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  UserRoundPlus,
  Wrench,
} from "lucide-react";

interface NavbarProps {
  searchTerm: string;
  cartItemCount: number;
  isAuthenticated: boolean;
  userName?: string;

  onSearchChange: (
    value: string
  ) => void;

  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
  onLogin: () => void;
  onLogout: () => void;

  onRegister?: () => void;
  onAccount?: () => void;
  onAccountOrders?: () => void;
  onAccountAddresses?: () => void;
  onAccountProfile?: () => void;
}

export default function Navbar({
  searchTerm,
  cartItemCount,
  isAuthenticated,
  userName,
  onSearchChange,
  onOpenCart,
  onOpenAdmin,
  onGoHome,
  onLogin,
  onLogout,
  onRegister,
  onAccount,
  onAccountOrders,
  onAccountAddresses,
  onAccountProfile,
}: NavbarProps) {
  const [
    isAccountMenuOpen,
    setIsAccountMenuOpen,
  ] = useState(false);

  const accountMenuRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const displayName =
    userName?.trim() ||
    "Cliente";

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          target
        )
      ) {
        setIsAccountMenuOpen(
          false
        );
      }
    };

    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        setIsAccountMenuOpen(
          false
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    isAccountMenuOpen,
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAccountMenuOpen(
        false
      );
    }
  }, [
    isAuthenticated,
  ]);

  const runAccountAction = (
    action?: () => void
  ) => {
    setIsAccountMenuOpen(
      false
    );

    action?.();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#97cf00]/30 bg-[#08101d]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[104px] items-center justify-between gap-5 px-6">
        {/* LOGO */}

        <button
          type="button"
          onClick={onGoHome}
          className="flex shrink-0 items-center transition hover:scale-105"
          aria-label="Ir al inicio"
        >
          <img
            src={logo}
            alt="PCByte"
            className="h-24 w-auto"
          />
        </button>

        {/* MENÚ PRINCIPAL */}

        <div className="hidden items-center gap-8 xl:flex">
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-[#97cf00]"
          >
            <Home size={17} />
            Inicio
          </button>

          <span className="flex items-center gap-2 text-sm font-bold text-[#97cf00]">
            <Laptop size={17} />
            Productos
          </span>

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-bold text-slate-300 transition hover:text-[#97cf00]"
          >
            <Wrench size={17} />
            Servicio Técnico
          </button>
        </div>

        {/* BUSCADOR */}

        <div className="hidden w-full max-w-md lg:block">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
              placeholder="Buscar productos..."
              className="h-11 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#97cf00]"
            />
          </div>
        </div>

        {/* ACCIONES */}

        <div className="flex shrink-0 items-center gap-3">
          {isAuthenticated ? (
            <div
              ref={accountMenuRef}
              className="relative hidden md:block"
            >
              <button
                type="button"
                onClick={() =>
                  setIsAccountMenuOpen(
                    (previous) =>
                      !previous
                  )
                }
                aria-expanded={
                  isAccountMenuOpen
                }
                aria-haspopup="menu"
                className={`flex h-14 min-w-[190px] items-center gap-3 rounded-2xl border pl-3 pr-4 text-left transition ${
                  isAccountMenuOpen
                    ? "border-[#97cf00]/50 bg-white/10"
                    : "border-white/10 bg-white/5 hover:border-[#97cf00]/40 hover:bg-white/10"
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#97cf00]/15 text-[#97cf00]">
                  <UserRound
                    size={17}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-black text-white">
                    {displayName}
                  </p>

                  <p className="mt-0.5 text-[9px] font-black uppercase tracking-wider text-[#97cf00]">
                    Mi cuenta
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={`shrink-0 text-slate-400 transition-transform ${
                    isAccountMenuOpen
                      ? "rotate-180 text-[#97cf00]"
                      : ""
                  }`}
                />
              </button>

              {isAccountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+0.75rem)] z-[100] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-[0_24px_70px_rgba(15,23,42,0.28)]"
                >
                  <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                    <p className="truncate text-sm font-black text-slate-900">
                      {displayName}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#0066FF]">
                      Cuenta registrada
                    </p>
                  </div>

                  <div className="space-y-1 p-2">
                    <AccountMenuButton
                      icon={
                        <LayoutDashboard
                          size={17}
                        />
                      }
                      label="Resumen"
                      description="Vista general de tu cuenta"
                      onClick={() =>
                        runAccountAction(
                          onAccount
                        )
                      }
                    />

                    <AccountMenuButton
                      icon={
                        <Package
                          size={17}
                        />
                      }
                      label="Mis pedidos"
                      description="Compras y seguimiento"
                      onClick={() =>
                        runAccountAction(
                          onAccountOrders ??
                            onAccount
                        )
                      }
                    />

                    <AccountMenuButton
                      icon={
                        <MapPin
                          size={17}
                        />
                      }
                      label="Mis direcciones"
                      description="Datos para tus entregas"
                      onClick={() =>
                        runAccountAction(
                          onAccountAddresses ??
                            onAccount
                        )
                      }
                    />

                    <AccountMenuButton
                      icon={
                        <Settings
                          size={17}
                        />
                      }
                      label="Mis datos"
                      description="Información personal"
                      onClick={() =>
                        runAccountAction(
                          onAccountProfile ??
                            onAccount
                        )
                      }
                    />
                  </div>

                  <div className="border-t border-slate-200 p-2">
                    <button
                      type="button"
                      onClick={() =>
                        runAccountAction(
                          onLogout
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-red-600 transition hover:bg-red-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                        <LogOut
                          size={17}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-black">
                          Cerrar sesión
                        </p>

                        <p className="mt-0.5 text-[10px] text-red-400">
                          Salir de tu cuenta
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden min-w-[170px] flex-col items-center md:flex">
              <button
                type="button"
                onClick={onLogin}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#97cf00]/30 bg-[#97cf00]/10 px-4 text-xs font-black text-[#b7e346] transition hover:bg-[#97cf00] hover:text-black"
              >
                <LogIn size={16} />
                Iniciar sesión
              </button>

              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                <span>
                  ¿Primera vez?
                </span>

                <button
                  type="button"
                  onClick={onRegister}
                  disabled={!onRegister}
                  className="inline-flex items-center gap-1 font-black text-[#97cf00] transition hover:text-white hover:underline disabled:cursor-default"
                >
                  <UserRoundPlus
                    size={12}
                  />

                  Regístrate gratis
                </button>
              </div>
            </div>
          )}

          {/* CUENTA EN MÓVIL */}

          <button
            type="button"
            onClick={
              isAuthenticated
                ? onAccount
                : onLogin
            }
            disabled={
              isAuthenticated &&
              !onAccount
            }
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-[#97cf00] hover:text-black md:hidden"
            aria-label={
              isAuthenticated
                ? "Mi cuenta"
                : "Iniciar sesión"
            }
          >
            {isAuthenticated ? (
              <UserRound
                size={18}
              />
            ) : (
              <LogIn
                size={18}
              />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-slate-400 transition hover:bg-[#97cf00] hover:text-black"
            aria-label="Abrir administración"
            title="Administración"
          >
            <ShieldCheck
              size={18}
            />
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0066FF] text-white transition hover:bg-[#97cf00] hover:text-black"
            aria-label="Abrir carrito"
          >
            <ShoppingCart
              size={21}
            />

            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[9px] font-black text-black">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

interface AccountMenuButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

const AccountMenuButton = ({
  icon,
  label,
  description,
  onClick,
}: AccountMenuButtonProps) => {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-100"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-slate-800">
          {label}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-400">
          {description}
        </p>
      </div>
    </button>
  );
};