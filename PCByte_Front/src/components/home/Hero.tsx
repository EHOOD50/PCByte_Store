import logo from "../../assets/logo.png";

import {
  ArrowRight,
  Cpu,
  HardDrive,
  Monitor,
  ShoppingBag,
} from "lucide-react";

interface HeroProps {
  onViewProducts: () => void;

  /*
   * Se mantiene temporalmente para no romper
   * el componente padre mientras terminamos
   * de retirar Servicio Técnico del lanzamiento.
   */
  onRequestDiagnostic?: () => void;
}

export default function Hero({
  onViewProducts,
}: HeroProps) {
  return (
    <section className="relative -mt-10 overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-r from-slate-900 via-[#080808] to-black px-8 py-6 shadow-2xl md:-mt-10 md:px-12 md:py-7">
      <div className="pointer-events-none absolute -left-20 bottom-[-7rem] h-64 w-64 rounded-full bg-[#97cf00]/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-16 top-[-7rem] h-64 w-64 rounded-full bg-[#0066FF]/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          {/* MARCA + MENSAJE */}
          <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-center md:gap-8">
            <img
              src={logo}
              alt="PCByte"
              className="h-20 w-auto shrink-0 object-contain md:h-24"
            />

            <div className="min-w-0">
              <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[#97cf00]">
                Tecnología que conecta
              </p>

              <h1 className="mt-2 text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
                Tecnología para lo que necesitas.
              </h1>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={onViewProducts}
            className="group flex min-h-[52px] shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#0066FF] px-7 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-[#97cf00] hover:text-black"
          >
            <ShoppingBag size={18} />

            Ver productos

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* ACCESOS VISUALES */}
        <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
          <button
            type="button"
            onClick={onViewProducts}
            className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.035] px-4 py-3 text-left transition hover:border-[#97cf00]/30 hover:bg-white/[0.06]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#97cf00]/10 text-[#97cf00]">
              <Cpu size={17} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-white">
                Componentes
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Hardware para tu equipo
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onViewProducts}
            className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.035] px-4 py-3 text-left transition hover:border-[#0066FF]/30 hover:bg-white/[0.06]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
              <Monitor size={17} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-white">
                Periféricos
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Equipa tu espacio
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onViewProducts}
            className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.035] px-4 py-3 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-300">
              <HardDrive size={17} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-white">
                Almacenamiento
              </p>

              <p className="mt-0.5 text-[9px] text-slate-500">
                Espacio para tus datos
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}