import { X, Send, Laptop, Monitor, Printer, Gamepad2 } from "lucide-react";

interface DiagnosticRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const equipmentTypes = [
  {
    value: "NOTEBOOK",
    label: "Notebook",
    icon: Laptop,
  },
  {
    value: "DESKTOP_PC",
    label: "PC de escritorio",
    icon: Monitor,
  },
  {
    value: "GAMER_BUILD",
    label: "Armado equipo gamer",
    icon: Gamepad2,
  },
  {
    value: "PRINTER",
    label: "Impresora",
    icon: Printer,
  },
];

const serviceTypes = [
  "Diagnóstico",
  "Reparación",
  "Mantenimiento",
  "Upgrade",
  "Instalación de software",
  "Armado / cotización",
];

export default function DiagnosticRequestModal({
  isOpen,
  onClose,
}: DiagnosticRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#97cf00]/30 bg-slate-950 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2 text-slate-400 transition-all hover:bg-red-500 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <aside className="bg-gradient-to-br from-[#97cf00]/20 via-slate-900 to-[#0066FF]/20 p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#97cf00]">
              PCByte Service
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase leading-tight text-white">
              Solicitar diagnóstico técnico
            </h2>

            <p className="mt-5 text-sm leading-6 text-slate-300">
              Cuéntanos qué ocurre con tu equipo. Revisaremos tu solicitud para
              orientarte con una solución adecuada.
            </p>

            <div className="mt-8 space-y-3 text-sm text-slate-300">
              <p>✓ Atención para notebooks y PC de escritorio</p>
              <p>✓ Armado y cotización de equipos gamer</p>
              <p>✓ Soporte para impresoras</p>
              <p>✓ Diagnóstico antes de intervenir</p>
            </div>
          </aside>

          <form
            className="max-h-[85vh] space-y-5 overflow-y-auto bg-white p-8 text-slate-900 custom-scrollbar"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Solicitud registrada de forma local. Próximo paso: conectar con backend.");
              onClose();
            }}
          >
            <div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Datos del cliente
              </h3>
              <p className="mt-1 text-xs font-bold text-slate-400">
                Esta información nos permitirá contactarte para coordinar el
                diagnóstico.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nombre completo" placeholder="Ej: Esteban Hood" />
              <Field label="Teléfono" placeholder="Ej: +56 9 1234 5678" />
              <Field
                label="Correo electrónico"
                placeholder="Ej: contacto@pcbyte.cl"
                type="email"
              />
              <Field label="Ciudad / comuna" placeholder="Ej: Santiago" />
            </div>

            <div>
              <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                Tipo de equipo
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                {equipmentTypes.map((item) => {
                  const Icon = item.icon;

                  return (
                    <label
                      key={item.value}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 transition-all hover:border-[#97cf00]"
                    >
                      <input
                        type="radio"
                        name="equipmentType"
                        value={item.value}
                        className="accent-[#97cf00]"
                        required
                      />
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-[#97cf00]">
                        <Icon size={18} />
                      </span>
                      <span className="text-xs font-black uppercase">
                        {item.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Marca" placeholder="Ej: HP, Lenovo, Epson" />
              <Field label="Modelo" placeholder="Ej: Pavilion 15, L3150" />
            </div>

            <div>
              <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                Servicio solicitado
              </label>

              <select
                required
                className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none transition-all focus:border-[#0066FF]"
              >
                <option value="">Selecciona una opción</option>
                {serviceTypes.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                Describe el problema
              </label>

              <textarea
                required
                rows={5}
                placeholder='Ej: "No enciende", "está muy lento", "la pantalla no da imagen", "necesito cotizar un equipo gamer"...'
                className="w-full resize-none rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none transition-all focus:border-[#0066FF]"
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border-2 border-slate-100 px-6 py-3 text-[10px] font-black uppercase text-slate-500 transition-all hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#0066FF] px-6 py-3 text-[10px] font-black uppercase text-white shadow-lg transition-all hover:bg-[#97cf00] hover:text-black"
              >
                <Send size={16} />
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </span>

      <input
        type={type}
        placeholder={placeholder}
        required
        className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm font-bold outline-none transition-all focus:border-[#0066FF]"
      />
    </label>
  );
}