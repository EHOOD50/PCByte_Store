import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
  onLogout: () => void;
}

const AdminHeader = ({
  onOpenSidebar,
  onLogout,
}: AdminHeaderProps) => {
  const [
    accountMenuOpen,
    setAccountMenuOpen,
  ] = useState(false);

  const accountMenuRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setAccountMenuOpen(
          false
        );
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-[88px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Abrir menú administrativo"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#0066FF]">
            PCByte
          </p>

          <h1 className="mt-1 truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
            Panel Administrativo
          </h1>

          <p className="mt-1 hidden text-sm text-slate-500 md:block">
            Gestiona toda la operación de la tienda desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="relative hidden xl:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Buscar productos, pedidos..."
            className="h-12 w-[300px] rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white"
          />
        </div>

        <button
          type="button"
          aria-label="Notificaciones"
          className="relative hidden h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 sm:flex"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#97cf00]" />
        </button>

        <div
          ref={accountMenuRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setAccountMenuOpen(
                (currentValue) =>
                  !currentValue
              )
            }
            aria-expanded={
              accountMenuOpen
            }
            aria-haspopup="menu"
            className="flex h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2.5 transition hover:border-slate-300 hover:bg-slate-50 sm:px-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#97cf00] text-xs font-black text-[#08101d]">
              EH
            </div>

            <div className="hidden min-w-0 text-left md:block">
              <p className="max-w-36 truncate text-xs font-black text-slate-900">
                Esteban Hood
              </p>

              <p className="mt-0.5 text-[8px] font-black uppercase tracking-wider text-[#0066FF]">
                SuperAdministrador
              </p>
            </div>

            <ChevronDown
              size={16}
              className={`hidden text-slate-400 transition-transform md:block ${
                accountMenuOpen
                  ? "rotate-180"
                  : ""
              }`}
            />
          </button>

          {accountMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,23,42,0.20)]"
            >
              <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#97cf00] text-sm font-black text-[#08101d]">
                    EH
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">
                      Esteban Hood
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />

                      <span className="text-[9px] font-bold text-slate-500">
                        Sesión activa
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#0066FF]/15 bg-[#0066FF]/10 px-3 py-1.5 text-[8px] font-black uppercase tracking-wider text-[#0066FF]">
                  <ShieldCheck size={13} />
                  SuperAdministrador
                </div>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-400 opacity-60"
                >
                  <UserRound size={17} />

                  <span className="flex-1 text-xs font-black">
                    Mi perfil
                  </span>

                  <span className="text-[8px] font-black uppercase tracking-wide">
                    Próximamente
                  </span>
                </button>
              </div>

              <div className="border-t border-slate-200 p-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountMenuOpen(
                      false
                    );

                    onLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut size={17} />

                  <span className="text-xs font-black">
                    Cerrar sesión
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;