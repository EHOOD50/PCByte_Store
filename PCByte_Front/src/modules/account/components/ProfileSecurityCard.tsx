import {
  KeyRound,
} from "lucide-react";

import type {
  ProfileSecurityCardProps,
} from "../types/profile";

const ProfileSecurityCard = ({
  email,
  onOpenPasswordModal,
}: ProfileSecurityCardProps) => {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
          <KeyRound size={21} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Seguridad
          </p>

          <h2 className="mt-1 text-lg font-black text-slate-900">
            Contraseña
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
          Cuenta asociada
        </p>

        <p className="mt-1 break-all text-sm font-bold text-slate-700">
          {email}
        </p>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Utiliza una contraseña segura y evita compartirla con otras personas.
      </p>

      <button
        type="button"
        onClick={onOpenPasswordModal}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-4 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
      >
        <KeyRound size={16} />
        Cambiar contraseña
      </button>
    </section>
  );
};

export default ProfileSecurityCard;