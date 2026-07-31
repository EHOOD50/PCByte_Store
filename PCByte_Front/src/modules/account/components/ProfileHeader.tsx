import {
  Edit3,
} from "lucide-react";

import {
  useMemo,
} from "react";

import type {
  ProfileHeaderProps,
} from "../types/profile";

const ProfileHeader = ({
  profile,
  isEditing,
  onEdit,
}: ProfileHeaderProps) => {
  const fullName =
    useMemo(() => {
      return [
        profile.firstName,
        profile.lastName,
      ]
        .filter(Boolean)
        .join(" ");
    }, [
      profile.firstName,
      profile.lastName,
    ]);

  const initials =
    useMemo(() => {
      const firstInitial =
        profile.firstName
          ?.trim()
          .charAt(0) ?? "";

      const lastInitial =
        profile.lastName
          ?.trim()
          .charAt(0) ?? "";

      return (
        `${firstInitial}${lastInitial}`
          .toUpperCase() ||
        "PC"
      );
    }, [
      profile.firstName,
      profile.lastName,
    ]);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
        Información personal
      </p>

      <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-xl font-black text-[#0066FF]">
            {initials}
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Mis datos
            </h1>

            <p className="mt-2 text-sm font-bold text-slate-700">
              {fullName}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Administra la información asociada a tu Cuenta PCByte.
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
          >
            <Edit3 size={17} />
            Editar datos
          </button>
        )}
      </div>
    </section>
  );
};

export default ProfileHeader;