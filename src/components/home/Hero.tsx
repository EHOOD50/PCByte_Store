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
    <section className="relative mb-10 overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-slate-900 via-[#0a0a0a] to-black px-8 py-14 shadow-2xl md:px-12 md:py-20">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#97cf00]/20 blur-3xl" />
      <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[#0066FF]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
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

        <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-300 md:text-lg md:leading-8">
          Venta online de equipos tecnológicos, periféricos, impresoras y
          software. Servicio técnico especializado con atención personalizada
          para ayudarte a encontrar la mejor solución para tus necesidades.
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

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-[#97cf00]/20 bg-[#97cf00]/5 p-6 text-left">
          <p className="text-sm font-black uppercase tracking-widest text-[#97cf00]">
            Nuestro compromiso
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            Diagnosticamos cada equipo con transparencia. Si una reparación no
            tiene solución o no es conveniente para el cliente, lo diremos con
            total honestidad.
          </p>
        </div>

        <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 md:grid-cols-3">
          <TrustItem
            icon={<ShieldCheck size={16} />}
            text="Asesoría personalizada"
          />
          <TrustItem
            icon={<Zap size={16} />}
            text="Soluciones reales y confiables"
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