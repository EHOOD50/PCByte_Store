import {
  ShoppingBag,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Monitor,
  Printer,
  Cpu,
  PackageCheck,
} from "lucide-react";

interface HowCanWeHelpProps {
  onViewProducts: () => void;
  onRequestDiagnostic: () => void;
}

export default function HowCanWeHelp({
  onViewProducts,
  onRequestDiagnostic,
}: HowCanWeHelpProps) {
  return (
    <section className="my-16">
      <div className="mb-8 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#97cf00]">
          Soluciones PCByte
        </p>

        <h2 className="mt-3 text-3xl font-black uppercase text-white md:text-4xl">
          ¿Cómo podemos ayudarte?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          Compra tecnología online o solicita diagnóstico para tu equipo con una
          atención cercana, honesta y personalizada.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 transition-all hover:border-[#0066FF]/50 hover:bg-[#0066FF]/10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0066FF]/20 text-[#97cf00]">
            <ShoppingBag size={28} />
          </div>

          <h3 className="text-2xl font-black uppercase text-white">
            Venta online
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Equipamiento tecnológico para personas, hogares y pequeñas empresas.
            Por ahora, nuestras ventas se realizan online.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <HelpItem icon={<Monitor size={16} />} text="Notebooks y computadores" />
            <HelpItem icon={<Printer size={16} />} text="Impresoras" />
            <HelpItem icon={<Cpu size={16} />} text="Componentes y periféricos" />
            <HelpItem icon={<PackageCheck size={16} />} text="Software y accesorios" />
          </div>

          <button
            onClick={onViewProducts}
            className="group mt-8 flex items-center gap-3 rounded-2xl bg-[#0066FF] px-7 py-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#97cf00] hover:text-black"
          >
            Ver nuestros productos
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
        </article>

        <article className="rounded-[2rem] border border-[#97cf00]/20 bg-[#97cf00]/[0.06] p-8 transition-all hover:border-[#97cf00]/60 hover:bg-[#97cf00]/10">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#97cf00]/20 text-[#97cf00]">
            <Wrench size={28} />
          </div>

          <h3 className="text-2xl font-black uppercase text-white">
            Servicio técnico
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Diagnóstico y reparación de notebooks, computadores e impresoras.
            Atención local para servicio técnico, con coordinación previa.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <HelpItem icon={<CheckCircle2 size={16} />} text="Diagnóstico honesto" />
            <HelpItem icon={<CheckCircle2 size={16} />} text="Mantenimiento" />
            <HelpItem icon={<CheckCircle2 size={16} />} text="Upgrade SSD / RAM" />
            <HelpItem icon={<CheckCircle2 size={16} />} text="Armado PC gamer" />
          </div>

          <button
            onClick={onRequestDiagnostic}
            className="group mt-8 flex items-center gap-3 rounded-2xl bg-[#97cf00] px-7 py-4 text-[10px] font-black uppercase tracking-widest text-black transition-all hover:scale-105"
          >
            Solicitar diagnóstico
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </button>
        </article>
      </div>
    </section>
  );
}

function HelpItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs font-bold text-slate-300">
      <span className="text-[#97cf00]">{icon}</span>
      {text}
    </div>
  );
}