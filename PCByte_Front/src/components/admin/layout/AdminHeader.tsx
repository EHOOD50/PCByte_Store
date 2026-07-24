import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

interface AdminHeaderProps {
  onOpenSidebar: () => void;
}

const AdminHeader = ({
  onOpenSidebar,
}: AdminHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-[88px] items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0066FF]">
            PCByte
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Panel Administrativo
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Gestiona toda la operación de la tienda desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden xl:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Buscar productos, pedidos..."
            className="h-12 w-[320px] rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#0066FF] focus:bg-white"
          />
        </div>

        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#97cf00]" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;