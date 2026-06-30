import logo from "../../assets/logo.png";
import {
  ArrowRight,
  ShoppingBag,
  Wrench,
  ShieldCheck,
  Zap,
  Headphones,
} from "lucide-react";

interface HeroProps {
  onViewProducts: () => void;
  onRequestDiagnostic: () => void;
}

export default function Hero({
  onViewProducts,
  onRequestDiagnostic,
}: HeroProps) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900 via-[#0a0a0a] to-black px-8 py-12 shadow-2xl md:px-12 md:py-16">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#97cf00]/20 blur-3xl" />
      <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[#0066FF]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <div className="mb-8 flex justify-center">
          <img
            src={logo}
            alt="PCByte"
            className="h-24 w-auto object-contain drop-shadow-2xl md:h-32"
          />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#97cf00]">
          PCByte
        </p>

        <h1 className="mt-4 text-4xl font-black uppercase leading-none tracking-tight text-white md:text-7xl">
          Tecnología que{" "}
          <span className="text-[#97cf00]">conecta.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
          Venta de equipos, periféricos, impresoras, software y servicio técnico
          especializado para personas, hogares y empresas.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={onViewProducts}
            className="group flex items-center justify-center gap-3 rounded-2xl bg-[#0066FF] px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-[#97cf00] hover:text-black active:scale-95"
          >
            <ShoppingBag size={17} />
            Ver nuestros productos
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <button
            onClick={onRequestDiagnostic}
            className="flex items-center justify-center gap-3 rounded-2xl border border-[#97cf00]/40 bg-[#97cf00]/10 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[#97cf00] transition-all hover:bg-[#97cf00] hover:text-black active:scale-95"
          >
            <Wrench size={17} />
            Solicitar diagnóstico
          </button>
        </div>

        <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 md:grid-cols-3">
          <TrustItem
            icon={<ShieldCheck size={16} />}
            text="Asesoría personalizada"
          />
          <TrustItem
            icon={<Zap size={16} />}
            text="Soluciones rápidas y confiables"
          />
          <TrustItem
            icon={<Headphones size={16} />}
            text="Atención técnica e informática"
          />
        </div>
      </div>
    </section>
  );
}

function TrustItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold text-slate-300">
      <span className="text-[#97cf00]">{icon}</span>
      {text}
    </div>
  );
}