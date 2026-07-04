import logo from "../../assets/logo.png";
import {
  Search,
  ShoppingCart,
  ShieldCheck,
  Home,
  Laptop,
  Wrench,
} from "lucide-react";

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cartItemCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onGoHome: () => void;
}

export default function Navbar({
  searchTerm,
  onSearchChange,
  cartItemCount,
  onOpenCart,
  onOpenAdmin,
  onGoHome,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#97cf00]/30 bg-[#08101d]/95 backdrop-blur-xl">

      <div className="mx-auto flex h-26 items-center justify-between px-6">

        {/* LOGO */}

        <button
          onClick={onGoHome}
          className="flex items-center hover:scale-105 transition"
        >
          <img
            src={logo}
            alt="PCByte"
            className="h-24 w-auto"
          />
        </button>

        {/* MENÚ */}

        <div className="hidden xl:flex items-center gap-10">

          <button
            onClick={onGoHome}
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-[#97cf00] transition"
          >
            <Home size={17} />
            Inicio
          </button>

          <span className="flex items-center gap-2 text-sm font-bold text-[#97cf00]">
            <Laptop size={17} />
            Productos
          </span>

          <button
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-[#97cf00] transition"
          >
            <Wrench size={17} />
            Servicio Técnico
          </button>

        </div>

        {/* BUSCADOR */}

<div className="hidden lg:block w-full max-w-md">

  <div className="relative">

    <Search
      size={17}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
    />

    <input
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Buscar productos..."
      className="h-11 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#97cf00]"
    />

  </div>

</div>

        {/* BOTONES */}

        <div className="flex items-center gap-3">

          <button
            onClick={onOpenAdmin}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-[#97cf00] hover:text-black transition"
          >
            <ShieldCheck size={18} />
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#0066FF] text-white hover:bg-[#97cf00] hover:text-black transition"
          >
            <ShoppingCart size={21} />

            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-black text-black">
                {cartItemCount}
              </span>
            )}

          </button>

        </div>

      </div>

    </nav>
  );
}