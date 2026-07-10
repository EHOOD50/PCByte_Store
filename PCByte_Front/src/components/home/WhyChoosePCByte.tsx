import {
  ShieldCheck,
  Handshake,
  BadgeCheck,
  HeartHandshake,
} from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Honestidad",
    text: "Siempre recibirás una recomendación clara y transparente.",
  },
  {
    icon: Handshake,
    title: "Atención personalizada",
    text: "Cada cliente recibe una solución según sus necesidades.",
  },
  {
    icon: BadgeCheck,
    title: "Calidad",
    text: "Productos y servicios seleccionados pensando en la confiabilidad.",
  },
  {
    icon: HeartHandshake,
    title: "Compromiso",
    text: "Te acompañamos antes, durante y después de tu compra o reparación.",
  },
];

export default function WhyChoosePCByte() {
  return (
    <section className="mt-4 mb-4">

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-white">
          ¿Por qué elegir PCByte?
        </h2>

        <p className="mt-3 text-slate-400">
          Más que vender tecnología, queremos convertirnos en tu socio de confianza.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-2xl bg-white/[0.035] px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06]"            >

              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#97cf00]/10">
                <Icon
                  size={18}
                  className="text-[#97cf00]"
                />
              </div>

              <h3 className="text-[15px] font-black text-white">
                {item.title}
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                {item.text}
              </p>

            </article>
          );
        })}

      </div>

    </section>
  );
}