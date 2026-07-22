import {
  CheckCircle2,
  Mail,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

interface ConfirmationStepProps {
  orderNumber?: string | null;
  email: string;
  onGoToCatalog: () => void;
}

export const ConfirmationStep = ({
  orderNumber,
  email,
  onGoToCatalog,
}: ConfirmationStepProps) => {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#97cf00]/15 text-[#6f9900]">
          <CheckCircle2 size={34} />
        </div>

        <p className="mt-6 text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
          Paso 5
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Tu compra fue registrada
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Recibimos correctamente la información de tu pedido. Te
          enviaremos las novedades de la compra al correo indicado.
        </p>

        {orderNumber && (
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-[#0066FF]/15 bg-[#f7faff] p-5">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-slate-400">
              Número de orden
            </p>

            <p className="mt-2 text-2xl font-black tracking-tight text-[#0066FF]">
              {orderNumber}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
            <Mail
              size={18}
              className="mt-0.5 shrink-0 text-[#0066FF]"
            />

            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Confirmación
              </p>

              <p className="mt-1 break-all text-xs font-bold leading-5 text-slate-600">
                {email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
            <PackageCheck
              size={18}
              className="mt-0.5 shrink-0 text-[#6f9900]"
            />

            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Seguimiento
              </p>

              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
                Te informaremos cada cambio importante de tu pedido.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#97cf00]/25 bg-[#97cf00]/5 p-4 text-left">
          <ShieldCheck
            size={18}
            className="mt-0.5 shrink-0 text-[#6f9900]"
          />

          <p className="text-[11px] leading-5 text-slate-600">
            Conserva el número de orden y el correo utilizado durante la
            compra para futuras consultas.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToCatalog}
          className="mt-7 inline-flex min-h-[50px] items-center justify-center rounded-xl bg-slate-900 px-8 text-xs font-black uppercase text-white transition hover:bg-[#0066FF]"
        >
          Volver al catálogo
        </button>
      </div>
    </section>
  );
};

export default ConfirmationStep;