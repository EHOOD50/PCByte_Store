import {
  Search,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";

import type {
  AdminUser,
} from "../../../api/adminUsersApi";

export type UserStatusFilter =
  | "ALL"
  | AdminUser["status"];

export type UserRoleFilter =
  | "ALL"
  | AdminUser["role"];

interface UserToolbarProps {
  searchTerm: string;
  statusFilter: UserStatusFilter;
  roleFilter: UserRoleFilter;

  totalUsers: number;
  filteredUsers: number;

  onSearchChange: (
    value: string
  ) => void;

  onStatusFilterChange: (
    value: UserStatusFilter
  ) => void;

  onRoleFilterChange: (
    value: UserRoleFilter
  ) => void;

  onClearFilters: () => void;
}

const UserToolbar = ({
  searchTerm,
  statusFilter,
  roleFilter,
  totalUsers,
  filteredUsers,
  onSearchChange,
  onStatusFilterChange,
  onRoleFilterChange,
  onClearFilters,
}: UserToolbarProps) => {
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    statusFilter !== "ALL" ||
    roleFilter !== "ALL";

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
              <UsersRound size={21} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                Gestión de cuentas
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                Usuarios
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            Mostrando{" "}
            <span className="font-black text-slate-800">
              {filteredUsers}
            </span>{" "}
            de{" "}
            <span className="font-black text-slate-800">
              {totalUsers}
            </span>{" "}
            usuarios.
          </p>
        </div>

        <div className="grid w-full gap-3 md:grid-cols-2 xl:w-auto xl:grid-cols-[minmax(260px,360px)_190px_170px_auto]">
          <div className="relative md:col-span-2 xl:col-span-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                onSearchChange(
                  event.target.value
                )
              }
              placeholder="Buscar por nombre, correo o teléfono"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                onStatusFilterChange(
                  event.target
                    .value as UserStatusFilter
                )
              }
              className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-black uppercase text-slate-700 outline-none transition focus:border-[#0066FF] focus:bg-white"
            >
              <option value="ALL">
                Todos los estados
              </option>

              <option value="REGISTRADO">
                Registrados
              </option>

              <option value="EMAIL_PENDIENTE_VERIFICACION">
                Pendientes
              </option>

              <option value="INVITADO">
                Invitados
              </option>

              <option value="BLOQUEADO">
                Bloqueados
              </option>
            </select>
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              onRoleFilterChange(
                event.target
                  .value as UserRoleFilter
              )
            }
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-black uppercase text-slate-700 outline-none transition focus:border-[#0066FF] focus:bg-white"
          >
            <option value="ALL">
              Todos los roles
            </option>

            <option value="USER">
              Clientes
            </option>

            <option value="ADMIN">
              Administradores
            </option>
          </select>

          <button
            type="button"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[10px] font-black uppercase tracking-wide text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <X size={16} />
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserToolbar;