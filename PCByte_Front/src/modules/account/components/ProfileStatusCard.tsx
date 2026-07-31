import {
  ShieldCheck,
} from "lucide-react";

import type {
  ProfileStatusCardProps,
} from "../types/profile";

const ProfileStatusCard = ({
  status,
}: ProfileStatusCardProps) => {
  const normalizedStatus =
    status
      .replaceAll("_", " ")
      .toLowerCase();

  const statusLabel =
    normalizedStatus.charAt(0).toUpperCase() +
    normalizedStatus.slice(1);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#6f9900]">
          <ShieldCheck size={21} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6f9900]">
            Estado de la cuenta
          </p>

          <h2 className="mt-1 text-lg font-black text-slate-900">
            Cuenta registrada
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#97cf00]/30 bg-[#97cf00]/10 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500">
            Estado
          </span>

          <span className="rounded-full bg-[#97cf00]/20 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#527200]">
            {statusLabel}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Tu cuenta se encuentra habilitada para realizar compras, administrar direcciones y consultar pedidos.
      </p>
    </section>
  );
};

export default ProfileStatusCard;