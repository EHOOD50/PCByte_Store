import logo from "../../assets/logo.png";
import {
  Cpu,
  Printer,
  Keyboard,
  Wrench,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface HeroProps {
  onSelectCategory: (category: string) => void;
}

export default function Hero({ onSelectCategory }: HeroProps) {
  return (
    <section className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-[#0a0a0a] to-black p-8 shadow-2xl">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#97cf00]/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#0066FF]/20 blur-3xl" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="mb-6 flex items-center gap-4">
            <img
              src={logo}
              alt="PCByte"
              className="h-16 w-auto object-contain drop-shadow-2xl"
            />

            <div className="hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#97cf00]">
                PCByte Store
              </p>
              <p className="text-xs font-bold text-slate-400">
                Venta • Servicio Técnico • Software
              </p>
            </div>
          </div>

          <h2 className="max-w-3xl text-4xl font-black uppercase leading-none tracking-tight text-white md:text-6xl">
            Tecnología que{" "}
            <span className="text-[#97cf00]">conecta.</span>
          </h2>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Equipos, periféricos, impresoras, software y servicio técnico
            especializado para personas, hogares y empresas.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onSelectCategory("TODOS")}
              className="rounded-2xl bg-[#0066FF] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-[#97cf00] hover:text-black active:scale-95"
            >
              Ver productos
            </button>

            <button
              onClick={() => onSelectCategory("SERVICIO TECNICO")}
              className="rounded-2xl border border-[#97cf00]/40 bg-[#97cf00]/10 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#97cf00] transition-all hover:bg-[#97cf00] hover:text-black active:scale-95"
            >
              Servicio técnico
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <QuickAccess
            icon={<Cpu size={22} />}
            title="Equipos"
            description="Computadores y notebooks"
            onClick={() => onSelectCategory("EQUIPOS")}
          />

          <QuickAccess
            icon={<Keyboard size={22} />}
            title="Periféricos"
            description="Teclados, mouse y accesorios"
            onClick={() => onSelectCategory("PERIFERICOS")}
          />

          <QuickAccess
            icon={<Printer size={22} />}
            title="Impresoras"
            description="Impresión para casa y empresa"
            onClick={() => onSelectCategory("IMPRESORAS")}
          />

          <QuickAccess
            icon={<Wrench size={22} />}
            title="Soporte"
            description="Servicio técnico especializado"
            onClick={() => onSelectCategory("SERVICIO TECNICO")}
          />
        </div>
      </div>

      <div className="relative z-10 mt-8 grid gap-3 border-t border-white/10 pt-6 md:grid-cols-3">
        <TrustItem
          icon={<ShieldCheck size={16} />}
          text="Asesoría personalizada"
        />
        <TrustItem
          icon={<Zap size={16} />}
          text="Soluciones rápidas y confiables"
        />
        <TrustItem
          icon={<Wrench size={16} />}
          text="Conocimiento técnico real"
        />
      </div>
    </section>
  );
}

function QuickAccess({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-left transition-all hover:-translate-y-1 hover:border-[#97cf00]/60 hover:bg-[#97cf00]/10"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0066FF]/20 text-[#97cf00] transition-all group-hover:bg-[#97cf00] group-hover:text-black">
        {icon}
      </div>

      <h3 className="text-sm font-black uppercase text-white">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </button>
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
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-bold text-slate-300">
      <span className="text-[#97cf00]">{icon}</span>
      {text}
    </div>
  );
}