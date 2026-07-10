import { useState } from "react";
import { Package, Boxes, Hash, FileText, ClipboardList, ShieldCheck } from "lucide-react";

import type { Product } from "../../../types/types";

interface ProductTabsProps {
  product: Product;
}

type Tab = "description" | "specifications" | "warranty";

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("description");

  return (
    <section className="mt-10 rounded-[2.5rem] border border-white/10 bg-[#111111]/80 p-8">

      {/* Navegación */}

      <div className="border-b border-white/10">

        <nav className="flex flex-wrap items-center gap-8">

          <button
            onClick={() => setActiveTab("description")}
            className={`group relative pb-4 text-sm font-bold transition-all duration-300 ${
  activeTab === "description"
    ? "text-white"
    : "text-slate-500 hover:text-slate-300"
}`}
          >
            <div className="flex items-center gap-2">
                <span
            className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#0066FF] transition-all duration-300 ${
              activeTab === "description"
               ? "w-full"
              : "w-0 group-hover:w-full"
            }`}
/>
              <FileText size={16} />
              Descripción
            </div>
          </button>

          <button
            onClick={() => setActiveTab("specifications")}
            className={`group relative pb-4 text-sm font-bold transition-all duration-300 ${
  activeTab === "specifications"
    ? "text-white"
    : "text-slate-500 hover:text-slate-300"
}`}
          >
            <div className="flex items-center gap-2">
                <span
            className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#0066FF] transition-all duration-300 ${
              activeTab === "specifications"
                ? "w-full"
                   : "w-0 group-hover:w-full"
             }`}
/>
              <ClipboardList size={16} />
              Especificaciones
            </div>
          </button>

          <button
            onClick={() => setActiveTab("warranty")}
            className={`group relative pb-4 text-sm font-bold transition-all duration-300 ${
            activeTab === "warranty"
              ? "text-white"
              : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <div className="flex items-center gap-2">
                <span
             className={`absolute bottom-0 left-0 h-[2px] rounded-full bg-[#0066FF] transition-all duration-300 ${
                activeTab === "warranty"
                 ? "w-full"
                 : "w-0 group-hover:w-full"
             }`}
/>
              <ShieldCheck size={16} />
              Garantía y Soporte
            </div>
          </button>

        </nav>

      </div>

      {/* CONTENIDO */}

      <div className="pt-8">

        {activeTab === "description" && (
          <div className="max-w-5xl">

            <p className="leading-8 text-slate-300 whitespace-pre-line">
              {product.description ||
                "Producto seleccionado por PCByte para entregar rendimiento, compatibilidad y confianza."}
            </p>

          </div>
        )}

        {activeTab === "specifications" && (
  <div className="max-w-4xl">
    <h3 className="mb-6 text-xl font-black uppercase tracking-tight text-white">
      Especificaciones
    </h3>

    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]">
      <div className="grid grid-cols-1 divide-y divide-white/10">
        <div className="grid gap-2 px-6 py-5 sm:grid-cols-[220px_1fr] sm:items-center">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Package size={15} className="text-[#97cf00]" />
            Categoría
          </span>

          <span className="text-sm font-bold text-white">
            {product.category?.name ?? "Producto"}
          </span>
        </div>

        <div className="grid gap-2 px-6 py-5 sm:grid-cols-[220px_1fr] sm:items-center">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Boxes size={15} className="text-[#97cf00]" />
            Stock
          </span>

          <span className="text-sm font-bold text-white">
            {product.stock} unidades
          </span>
        </div>

        <div className="grid gap-2 px-6 py-5 sm:grid-cols-[220px_1fr] sm:items-center">
          <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Hash size={15} className="text-[#97cf00]" />
            Código interno
          </span>

          <span className="text-sm font-bold text-white">
            PCB-{String(product.id).padStart(5, "0")}
          </span>
        </div>
      </div>
    </div>

    <p className="mt-5 text-xs leading-6 text-slate-500">
      Las especificaciones completas del producto estarán disponibles cuando se
      integren los datos técnicos desde el catálogo avanzado de PCByte.
    </p>
  </div>
)}

        

        {activeTab === "warranty" && (
  <div className="max-w-5xl">

    <h3 className="mb-6 text-xl font-black uppercase tracking-tight text-white">
      Garantía y Soporte PCByte
    </h3>

    <div className="rounded-[2rem] border border-[#97cf00]/20 bg-[#97cf00]/5 p-6">

      <p className="leading-8 text-slate-300">
        Al comprar en <strong className="text-white">PCByte</strong> no solo
        adquieres un producto. También cuentas con el respaldo de nuestro
        equipo técnico para acompañarte antes, durante y después de tu compra.
      </p>

    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-2">

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h4 className="mb-4 font-black uppercase text-[#97cf00]">
          Incluye
        </h4>

        <ul className="space-y-3 text-sm text-slate-300">

          <li>✔ Garantía legal conforme a la legislación chilena.</li>

          <li>✔ Garantía del fabricante cuando corresponda.</li>

          <li>✔ Gestión de garantía con proveedores.</li>

          <li>✔ Servicio técnico especializado.</li>

          <li>✔ Atención postventa.</li>

        </ul>

      </div>

      <div className="rounded-2xl border border-[#0066FF]/30 bg-[#0066FF]/5 p-5">

        <h4 className="mb-4 font-black uppercase text-[#0066FF]">
          ¿Necesitas ayuda?
        </h4>

        <p className="leading-7 text-slate-300">
          Si tienes dudas sobre la compatibilidad de este producto con tu
          computador o notebook, nuestro equipo puede orientarte antes de
          realizar la compra.
        </p>

        <button
          className="mt-6 rounded-xl bg-[#25D366] px-5 py-3 text-xs font-black uppercase tracking-widest text-black transition-all hover:scale-105"
        >
          Hablar con un especialista
        </button>

      </div>

    </div>

  </div>
)}

      </div>

    </section>
  );
}