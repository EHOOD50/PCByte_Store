import {
  ShieldCheck,
  Wrench,
  Cpu,
  Headphones,
  BadgeCheck,
  Truck,
} from "lucide-react";

export default function WhyChoosePCByte() {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#97cf00]">
          Confianza tecnológica
        </p>

        <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white">
          ¿Por qué elegir <span className="text-[#97cf00]">PCByte?</span>
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
          No solo vendemos tecnología. Te ayudamos a elegir, instalar, mantener
          y reparar tus equipos con conocimiento técnico real.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        <FeatureCard
          icon={<Cpu size={24} />}
          title="Venta especializada"
          description="Equipos, periféricos, impresoras y software seleccionados según tus necesidades."
        />

        <FeatureCard
          icon={<Wrench size={24} />}
          title="Servicio técnico real"
          description="Diagnóstico, mantenimiento, reparación y soporte especializado para tus equipos."
        />

        <FeatureCard
          icon={<ShieldCheck size={24} />}
          title="Compra segura"
          description="Atención responsable, orientación clara y respaldo durante todo el proceso."
        />

        <FeatureCard
          icon={<Headphones size={24} />}
          title="Asesoría personalizada"
          description="Te ayudamos a escoger la solución correcta para hogar, estudio, trabajo o empresa."
        />

        <FeatureCard
          icon={<BadgeCheck size={24} />}
          title="Garantía y soporte"
          description="Productos y servicios con seguimiento para que compres con mayor tranquilidad."
        />

        <FeatureCard
          icon={<Truck size={24} />}
          title="Soluciones para empresas"
          description="Equipamiento, soporte y tecnología para negocios que necesitan continuidad operativa."
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <article className="group rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 transition-all hover:-translate-y-1 hover:border-[#97cf00]/50 hover:bg-[#97cf00]/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0066FF]/15 text-[#97cf00] transition-all group-hover:bg-[#97cf00] group-hover:text-black">
        {icon}
      </div>

      <h3 className="text-sm font-black uppercase tracking-wide text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </article>
  );
}