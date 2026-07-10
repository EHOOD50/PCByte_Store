import logo from "../../assets/logo.png";
import heroImage from "../../assets/hero.png";
import { ShoppingBag, Wrench } from "lucide-react";

interface HeroProps {
  onViewProducts: () => void;
  onRequestDiagnostic: () => void;
}

export default function Hero({
  onViewProducts,
  onRequestDiagnostic,
}: HeroProps) {
  return (
    <section className="relative -mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-[#080808] to-black px-8 pt-6 pb-8 shadow-2xl md:-mt-10 md:px-12 md:pt-7 md:pb-9">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0066FF]/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#97cf00]/10 blur-3xl" />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <img
            src={logo}
            alt="PCByte"
            className="h-40 w-auto object-contain md:h-48"
          />

          <h1 className="mt-5 max-w-2xl text-3xl font-black leading-tight text-white md:text-5xl">
            Venta online de tecnología
            <br />
            <span className="text-slate-200">
              y servicio técnico especializado.
            </span>
          </h1>

          <p className="mt-3 text-sm italic text-[#97cf00] md:text-base">
            Tecnología que conecta.
          </p>

          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
            Compra con confianza y cuenta con un servicio técnico cercano,
            honesto y profesional cuando lo necesites.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={onViewProducts}
              className="flex h-16 items-center justify-center gap-3 rounded-2xl bg-[#0066FF] px-6 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-[#97cf00] hover:text-black"
            >
              <ShoppingBag size={18} />
              Ver nuestros productos
            </button>

            <button
              onClick={onRequestDiagnostic}
              className="flex h-16 items-center justify-center gap-3 rounded-2xl border border-[#97cf00] px-6 text-[10px] font-black uppercase tracking-widest text-[#97cf00] transition hover:bg-[#97cf00] hover:text-black"
            >
              <Wrench size={18} />
              Solicitar diagnóstico
            </button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end lg:pr-4">
          <img
            src={heroImage}
            alt="Servicio técnico PCByte"
            className="w-full max-w-[900px] rounded-[1.75rem] object-cover shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}