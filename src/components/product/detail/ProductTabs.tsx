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

        <nav className="flex gap-10">

          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-sm font-black transition-all ${
              activeTab === "description"
                ? "border-b-2 border-[#0066FF] text-white"
                : "text-slate-500 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              Descripción
            </div>
          </button>

          <button
            onClick={() => setActiveTab("specifications")}
            className={`pb-4 text-sm font-black transition-all ${
              activeTab === "specifications"
                ? "border-b-2 border-[#0066FF] text-white"
                : "text-slate-500 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <ClipboardList size={16} />
              Especificaciones
            </div>
          </button>

          <button
            onClick={() => setActiveTab("warranty")}
            className={`pb-4 text-sm font-black transition-all ${
              activeTab === "warranty"
                ? "border-b-2 border-[#0066FF] text-white"
                : "text-slate-500 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
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

          <div className="max-w-3xl divide-y divide-white/10">

            <div className="flex justify-between py-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Package size={16} />
                Categoría
              </div>

              <span>{product.category?.name}</span>
            </div>

            <div className="flex justify-between py-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Boxes size={16} />
                Stock
              </div>

              <span>{product.stock} unidades</span>
            </div>

            <div className="flex justify-between py-4">
              <div className="flex items-center gap-2 text-slate-400">
                <Hash size={16} />
                Código
              </div>

              <span>
                PCB-{String(product.id).padStart(5, "0")}
              </span>

            </div>

          </div>

        )}

        {activeTab === "warranty" && (

          <div className="max-w-4xl space-y-6">

            <p className="leading-8 text-slate-300">
              Todos los productos comercializados por <strong>PCByte</strong>
              cuentan con garantía conforme a la legislación chilena.
              Además, nuestro equipo técnico puede ayudarte durante el proceso
              de garantía y resolver cualquier duda relacionada con tu compra.
            </p>

            <ul className="space-y-3 text-slate-300">

              <li>✔ Garantía legal.</li>

              <li>✔ Gestión con fabricante cuando corresponda.</li>

              <li>✔ Servicio técnico especializado.</li>

              <li>✔ Atención postventa.</li>

            </ul>

          </div>

        )}

      </div>

    </section>
  );
}