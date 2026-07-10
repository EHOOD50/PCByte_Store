import {
  Laptop,
  Wrench,
  HardDrive,
  ShieldCheck,
  Briefcase,
  Settings,
} from "lucide-react";

interface TechnicalServiceProps {
  onRequestDiagnostic: () => void;
}

const services = [
  {
    icon: Laptop,
    title: "Reparación de Notebooks",
    description: "Diagnóstico y reparación de notebooks de las principales marcas.",
  },
  {
    icon: Wrench,
    title: "Mantenimiento Preventivo",
    description: "Limpieza interna, cambio de pasta térmica y revisión completa.",
  },
  {
    icon: HardDrive,
    title: "Upgrade de Equipos",
    description: "Instalación de SSD, ampliación de memoria RAM y mejoras de rendimiento.",
  },
  {
    icon: Settings,
    title: "Instalación de Software",
    description: "Windows, Office, antivirus, drivers y configuración de equipos.",
  },
  {
    icon: Briefcase,
    title: "Soporte para Empresas",
    description: "Atención a empresas, mantenimiento y soporte tecnológico.",
  },
  {
    icon: ShieldCheck,
    title: "Diagnóstico Profesional",
    description: "Evaluación técnica antes de cualquier reparación o reemplazo.",
  },
];

export default function TechnicalService({
  onRequestDiagnostic,
}: TechnicalServiceProps) {
  return (
    <section className="mt-24 mb-24">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="text-[#97cf00] text-[10px] font-black uppercase tracking-[0.35em]">
          Servicio Técnico
        </p>

        <h2 className="mt-3 text-4xl font-black uppercase text-white">
          Tecnología que también
          <span className="text-[#97cf00]"> reparamos</span>
        </h2>

        <p className="mt-6 text-slate-400 leading-7">
          En PCByte no solamente vendemos tecnología. También la diagnosticamos,
          la mantenemos y la reparamos con atención personalizada y honestidad.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <article
              key={service.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#97cf00]/40"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0066FF]/15 transition-all group-hover:bg-[#97cf00]">
                <Icon
                  size={28}
                  className="text-[#97cf00] group-hover:text-black"
                />
              </div>

              <h3 className="mb-3 text-lg font-black text-white">
                {service.title}
              </h3>

              <p className="text-sm leading-6 text-slate-400">
                {service.description}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={onRequestDiagnostic}
          className="rounded-2xl bg-[#97cf00] px-10 py-4 font-black uppercase tracking-wider text-black shadow-xl transition-all hover:scale-105"
        >
          Solicitar Diagnóstico
        </button>
      </div>
    </section>
  );
}