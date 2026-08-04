import {
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";

import UserStatusBadge from "./UserStatusBadge";

import type {
  AdminUser,
} from "../../../api/adminUsersApi";

interface UserDrawerProps {
  user: AdminUser | null;
  updatingStatus: boolean;

  onClose: () => void;

  onBlockUser: (
    user: AdminUser
  ) => void;

  onUnblockUser: (
    user: AdminUser
  ) => void;
}

const formatDate = (
  value: string
): string => {
  if (!value) {
    return "Sin información";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Sin información";
  }

  return new Intl.DateTimeFormat(
    "es-CL",
    {
      dateStyle: "long",
      timeStyle: "short",
    }
  ).format(date);
};

const getInitials = (
  user: AdminUser
): string => {
  const firstInitial =
    user.firstName
      ?.trim()
      .charAt(0) ?? "";

  const lastInitial =
    user.lastName
      ?.trim()
      .charAt(0) ?? "";

  return (
    `${firstInitial}${lastInitial}`
      .toUpperCase() ||
    "U"
  );
};

const UserDrawer = ({
  user,
  updatingStatus,
  onClose,
  onBlockUser,
  onUnblockUser,
}: UserDrawerProps) => {
  if (!user) {
    return null;
  }

  const fullName =
    `${user.firstName ?? ""} ${user.lastName ?? ""}`
      .trim() ||
    "Usuario sin nombre";

  const isBlocked =
    user.status ===
    "BLOQUEADO";

  return (
    <div className="fixed inset-0 z-[220]">
      <button
        type="button"
        aria-label="Cerrar detalle del usuario"
        onClick={onClose}
        disabled={updatingStatus}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm disabled:cursor-wait"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-slate-50 shadow-2xl">
        <header className="border-b border-slate-200 bg-[#08101d] px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00] text-lg font-black text-[#08101d]">
                {getInitials(
                  user
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#97cf00]">
                  Detalle del usuario
                </p>

                <h2 className="mt-1 truncate text-xl font-black">
                  {fullName}
                </h2>

                <p className="mt-1 truncate text-xs text-slate-400">
                  ID #{user.id}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={updatingStatus}
              aria-label="Cerrar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={
                <Mail size={18} />
              }
              label="Correo electrónico"
              value={user.email}
            />

            <InfoCard
              icon={
                <Phone size={18} />
              }
              label="Teléfono"
              value={
                user.phone ||
                "Sin teléfono"
              }
            />
          </div>

          <section className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#0066FF]">
                  Estado de la cuenta
                </p>

                <h3 className="mt-1 text-base font-black text-slate-900">
                  Seguridad y acceso
                </h3>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <StatusField
                label="Rol"
                value={
                  user.role ===
                  "ADMIN" ? (
                    <UserStatusBadge
                      label="Administrador"
                      color="blue"
                    />
                  ) : (
                    <UserStatusBadge
                      label="Cliente"
                      color="gray"
                    />
                  )
                }
              />

              <StatusField
                label="Estado"
                value={
                  <AccountStatusBadge
                    status={
                      user.status
                    }
                  />
                }
              />

              <StatusField
                label="Correo"
                value={
                  user.emailVerified ? (
                    <UserStatusBadge
                      label="Verificado"
                      color="green"
                    />
                  ) : (
                    <UserStatusBadge
                      label="Pendiente"
                      color="yellow"
                    />
                  )
                }
              />
            </div>
          </section>

          <section className="mt-5 grid gap-4 sm:grid-cols-2">
            <MetricCard
              icon={
                <Package size={20} />
              }
              label="Pedidos"
              value={
                user.orderCount
              }
              description="Órdenes asociadas"
            />

            <MetricCard
              icon={
                <MapPin size={20} />
              }
              label="Direcciones"
              value={
                user.addressCount
              }
              description="Direcciones guardadas"
            />
          </section>

          <section className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <CalendarDays
                size={20}
                className="text-[#0066FF]"
              />

              <h3 className="text-base font-black text-slate-900">
                Historial de la cuenta
              </h3>
            </div>

            <div className="mt-5 space-y-4">
              <TimelineItem
                label="Cuenta creada"
                value={formatDate(
                  user.createdAt
                )}
              />

              <TimelineItem
                label="Última actualización"
                value={formatDate(
                  user.updatedAt
                )}
              />
            </div>
          </section>

          <section className="mt-5 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                  isBlocked
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {isBlocked ? (
                  <ShieldOff size={19} />
                ) : (
                  <LockKeyhole size={19} />
                )}
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Acción administrativa
                </p>

                <h3 className="mt-1 text-base font-black text-slate-900">
                  {isBlocked
                    ? "Desbloquear cuenta"
                    : "Bloquear cuenta"}
                </h3>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              {isBlocked
                ? "El usuario podrá volver a iniciar sesión cuando su cuenta sea habilitada."
                : "El usuario perderá el acceso a su cuenta hasta que un administrador la desbloquee."}
            </p>

            <button
              type="button"
              disabled={updatingStatus}
              onClick={() => {
                if (isBlocked) {
                  onUnblockUser(
                    user
                  );

                  return;
                }

                onBlockUser(
                  user
                );
              }}
              className={`mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-xs font-black uppercase tracking-wide text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isBlocked
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {updatingStatus ? (
                "Actualizando..."
              ) : isBlocked ? (
                <>
                  <ShieldOff size={17} />
                  Desbloquear usuario
                </>
              ) : (
                <>
                  <LockKeyhole size={17} />
                  Bloquear usuario
                </>
              )}
            </button>
          </section>

          <section className="mt-5 rounded-[1.75rem] border border-[#97cf00]/30 bg-[#97cf00]/10 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-[#5f8200]"
              />

              <div>
                <p className="text-sm font-black text-slate-800">
                  Información protegida
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Este panel no muestra contraseñas, tokens ni datos sensibles de autenticación.
                </p>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
};

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoCard = ({
  icon,
  label,
  value,
}: InfoCardProps) => {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
        {icon}
      </div>

      <p className="mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-slate-800">
        {value}
      </p>
    </div>
  );
};

interface StatusFieldProps {
  label: string;
  value: React.ReactNode;
}

const StatusField = ({
  label,
  value,
}: StatusFieldProps) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2">
        {value}
      </div>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}

const MetricCard = ({
  icon,
  label,
  value,
  description,
}: MetricCardProps) => {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
          {icon}
        </div>

        <span className="text-3xl font-black text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-black text-slate-800">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
};

interface TimelineItemProps {
  label: string;
  value: string;
}

const TimelineItem = ({
  label,
  value,
}: TimelineItemProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#97cf00]" />

      <div>
        <p className="text-xs font-black text-slate-700">
          {label}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {value}
        </p>
      </div>
    </div>
  );
};

interface AccountStatusBadgeProps {
  status: AdminUser["status"];
}

const AccountStatusBadge = ({
  status,
}: AccountStatusBadgeProps) => {
  switch (status) {
    case "REGISTRADO":
      return (
        <UserStatusBadge
          label="Registrado"
          color="green"
        />
      );

    case "EMAIL_PENDIENTE_VERIFICACION":
      return (
        <UserStatusBadge
          label="Pendiente"
          color="yellow"
        />
      );

    case "BLOQUEADO":
      return (
        <UserStatusBadge
          label="Bloqueado"
          color="red"
        />
      );

    default:
      return (
        <UserStatusBadge
          label="Invitado"
          color="gray"
        />
      );
  }
};

export default UserDrawer;