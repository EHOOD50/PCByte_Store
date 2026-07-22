import {
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

import logo from "../../assets/logo.png";

interface CheckoutHeaderProps {
  onBack: () => void;
}

export const CheckoutHeader = ({
  onBack,
}: CheckoutHeaderProps) => {
  return (
    <header className="border-b border-slate-100 bg-gradient-to-r from-[#f7fbef] via-white to-[#f3f7ff] px-6 py-4 sm:px-8">
      <div className="grid items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
        <img
          src={logo}
          alt="PCByte"
          className="mx-auto h-auto w-48 object-contain sm:w-56 lg:mx-0"
        />

        <div className="text-center lg:border-l lg:border-slate-200 lg:pl-7 lg:text-left">
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
            Checkout PCByte
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Finaliza tu compra
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            Revisa tus datos, selecciona la dirección de despacho y continúa
            al pago de forma segura.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
          >
            <ChevronLeft size={15} />
            Volver
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-[#97cf00]/30 bg-[#97cf00]/10 px-4 py-3 text-[9px] font-black uppercase tracking-wider text-[#5f8200]">
            <ShieldCheck size={15} />
            Compra segura
          </div>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;