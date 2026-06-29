import logo from "../assets/logo.png";
import { Search, ShoppingCart, ShieldCheck } from "lucide-react";

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
    <nav className="sticky top-0 z-50 h-20 px-6 flex items-center justify-between border-b-2 border-[#97cf00] bg-slate-900 shadow-2xl">

      {/* Logo */}
      <button
        onClick={onGoHome}
        className="flex items-center transition-transform duration-300 hover:scale-105"
      >
        <img
          src={logo}
          alt="PCByte"
          className="h-12 w-auto object-contain"
        />
      </button>

      {/* Buscador */}
      <div className="flex-1 max-w-xl px-8 hidden md:block">
        <div className="relative group">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#97cf00]"
          />

          <input
            type="text"
            placeholder="BUSCAR EN EL SISTEMA..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-12 text-[10px] font-black uppercase outline-none transition-all focus:border-[#97cf00]"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3">

        <button
          onClick={onOpenAdmin}
          className="rounded-xl border border-white/5 bg-white/5 p-2.5 text-slate-400 transition-all hover:text-[#97cf00]"
        >
          <ShieldCheck size={20} />
        </button>

        <button
          onClick={onOpenCart}
          className="group relative rounded-xl bg-[#0066FF] p-3 shadow-lg transition-all hover:bg-[#97cf00]"
        >
          <ShoppingCart
            size={22}
            className="text-white"
          />

          {cartItemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-[9px] font-black text-slate-900">
              {cartItemCount}
            </span>
          )}
        </button>

      </div>

    </nav>
  );
}