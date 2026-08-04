import {
  Eye,
  ShieldOff,
  UserX,
} from "lucide-react";

import UserStatusBadge from "./UserStatusBadge";

import type {
  AdminUser,
} from "../../../api/adminUsersApi";

interface UserTableProps {
  users: AdminUser[];

  onViewUser: (
    user: AdminUser
  ) => void;

  onToggleUserStatus: (
    user: AdminUser
  ) => void;
}

const UserTable = ({
  users,
  onViewUser,
  onToggleUserStatus,
}: UserTableProps) => {
  const getRoleBadge = (
    role: AdminUser["role"]
  ) => {
    if (role === "ADMIN") {
      return (
        <UserStatusBadge
          label="Administrador"
          color="blue"
        />
      );
    }

    return (
      <UserStatusBadge
        label="Cliente"
        color="gray"
      />
    );
  };

  const getStatusBadge = (
    status: AdminUser["status"]
  ) => {
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

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[980px]">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
              Usuario
            </th>

            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
              Rol
            </th>

            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
              Estado
            </th>

            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-500">
              Correo
            </th>

            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
              Pedidos
            </th>

            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
              Direcciones
            </th>

            <th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isBlocked =
              user.status ===
              "BLOQUEADO";

            const fullName =
              `${user.firstName ?? ""} ${user.lastName ?? ""}`
                .trim() ||
              "Usuario";

            return (
              <tr
                key={user.id}
                onDoubleClick={() =>
                  onViewUser(user)
                }
                className="cursor-pointer border-t border-slate-200 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">
                    {fullName}
                  </div>

                  <div className="mt-1 text-sm text-slate-500">
                    {user.phone ||
                      "Sin teléfono"}
                  </div>
                </td>

                <td className="px-6 py-4">
                  {getRoleBadge(
                    user.role
                  )}
                </td>

                <td className="px-6 py-4">
                  {getStatusBadge(
                    user.status
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-slate-700">
                    {user.email}
                  </div>

                  <div className="mt-2">
                    <UserStatusBadge
                      label={
                        user.emailVerified
                          ? "Verificado"
                          : "Pendiente"
                      }
                      color={
                        user.emailVerified
                          ? "green"
                          : "yellow"
                      }
                    />
                  </div>
                </td>

                <td className="px-6 py-4 text-center font-black text-slate-700">
                  {user.orderCount}
                </td>

                <td className="px-6 py-4 text-center font-black text-slate-700">
                  {user.addressCount}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        onViewUser(
                          user
                        );
                      }}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-[#0066FF]"
                      title="Ver usuario"
                      aria-label={`Ver usuario ${fullName}`}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();

                        onToggleUserStatus(
                          user
                        );
                      }}
                      className={`rounded-lg p-2 transition ${
                        isBlocked
                          ? "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          : "text-slate-500 hover:bg-red-50 hover:text-red-600"
                      }`}
                      title={
                        isBlocked
                          ? "Desbloquear usuario"
                          : "Bloquear usuario"
                      }
                      aria-label={
                        isBlocked
                          ? `Desbloquear usuario ${fullName}`
                          : `Bloquear usuario ${fullName}`
                      }
                    >
                      {isBlocked ? (
                        <ShieldOff
                          size={18}
                        />
                      ) : (
                        <UserX
                          size={18}
                        />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;