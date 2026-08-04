import {
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  useAdminUsers,
} from "../../../hooks/useAdminUsers";

import ConfirmDialog from "../../common/ConfirmDialog";
import UserDrawer from "./UserDrawer";
import UserTable from "./UserTable";
import UserToolbar from "./UserToolbar";

import type {
  AdminUser,
  AdminUserStatus,
} from "../../../api/adminUsersApi";

import type {
  UserRoleFilter,
  UserStatusFilter,
} from "./UserToolbar";

type PendingStatusAction =
  | "BLOCK"
  | "UNBLOCK";

interface PendingConfirmation {
  user: AdminUser;
  action: PendingStatusAction;
}

const UserManager = () => {
  const {
    users,
    loading,
    error,
    reload,
    changeStatus,
  } = useAdminUsers();

  const [
    selectedUser,
    setSelectedUser,
  ] =
    useState<AdminUser | null>(
      null
    );

  const [
    pendingConfirmation,
    setPendingConfirmation,
  ] =
    useState<PendingConfirmation | null>(
      null
    );

  const [
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<UserStatusFilter>(
      "ALL"
    );

  const [
    roleFilter,
    setRoleFilter,
  ] =
    useState<UserRoleFilter>(
      "ALL"
    );

  const filteredUsers =
    useMemo(() => {
      const search =
        searchTerm
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const fullName =
            `${user.firstName ?? ""} ${user.lastName ?? ""}`
              .trim()
              .toLowerCase();

          const matchesSearch =
            search === "" ||
            fullName.includes(
              search
            ) ||
            user.email
              .toLowerCase()
              .includes(
                search
              ) ||
            (
              user.phone ?? ""
            )
              .toLowerCase()
              .includes(
                search
              );

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            user.status ===
              statusFilter;

          const matchesRole =
            roleFilter ===
              "ALL" ||
            user.role ===
              roleFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesRole
          );
        }
      );
    }, [
      users,
      searchTerm,
      statusFilter,
      roleFilter,
    ]);

  const clearFilters =
    () => {
      setSearchTerm("");
      setStatusFilter(
        "ALL"
      );
      setRoleFilter(
        "ALL"
      );
    };

  const openStatusConfirmation =
    (
      user: AdminUser
    ) => {
      setPendingConfirmation({
        user,
        action:
          user.status ===
          "BLOQUEADO"
            ? "UNBLOCK"
            : "BLOCK",
      });
    };

  const closeStatusConfirmation =
    () => {
      if (updatingStatus) {
        return;
      }

      setPendingConfirmation(
        null
      );
    };

  const confirmStatusChange =
    async () => {
      if (
        !pendingConfirmation ||
        updatingStatus
      ) {
        return;
      }

      const {
        user,
        action,
      } = pendingConfirmation;

      const nextStatus:
        AdminUserStatus =
          action === "BLOCK"
            ? "BLOQUEADO"
            : user.emailVerified
              ? "REGISTRADO"
              : "EMAIL_PENDIENTE_VERIFICACION";

      setUpdatingStatus(true);

      try {
        const updatedUser =
          await changeStatus(
            user.id,
            nextStatus
          );

        setSelectedUser(
          (currentUser) =>
            currentUser?.id ===
            updatedUser.id
              ? updatedUser
              : currentUser
        );

        setPendingConfirmation(
          null
        );

        toast.success(
          action === "BLOCK"
            ? "Usuario bloqueado correctamente."
            : "Usuario desbloqueado correctamente."
        );
      } catch {
        toast.error(
          action === "BLOCK"
            ? "No fue posible bloquear al usuario."
            : "No fue posible desbloquear al usuario."
        );
      } finally {
        setUpdatingStatus(false);
      }
    };

  const handleCloseDrawer =
    () => {
      if (updatingStatus) {
        return;
      }

      setSelectedUser(
        null
      );
    };

  if (loading) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-center text-sm font-bold text-slate-500">
          Cargando usuarios...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[2rem] border border-red-200 bg-red-50 p-8 shadow-sm">
        <p className="text-center text-sm font-bold text-red-600">
          {error}
        </p>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              void reload();
            }}
            className="rounded-xl bg-[#0066FF] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  const confirmationUser =
    pendingConfirmation?.user;

  const confirmationName =
    confirmationUser
      ? `${confirmationUser.firstName ?? ""} ${confirmationUser.lastName ?? ""}`
          .trim() ||
        confirmationUser.email
      : "";

  const isBlocking =
    pendingConfirmation?.action ===
    "BLOCK";

  return (
    <>
      <div className="space-y-6">
        <UserToolbar
          searchTerm={
            searchTerm
          }
          statusFilter={
            statusFilter
          }
          roleFilter={
            roleFilter
          }
          totalUsers={
            users.length
          }
          filteredUsers={
            filteredUsers.length
          }
          onSearchChange={
            setSearchTerm
          }
          onStatusFilterChange={
            setStatusFilter
          }
          onRoleFilterChange={
            setRoleFilter
          }
          onClearFilters={
            clearFilters
          }
        />

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          {filteredUsers.length ===
          0 ? (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <div>
                <p className="text-sm font-black text-slate-700">
                  No se encontraron usuarios
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Ajusta la búsqueda o limpia los filtros activos.
                </p>
              </div>
            </div>
          ) : (
            <UserTable
              users={
                filteredUsers
              }
              onViewUser={
                setSelectedUser
              }
              onToggleUserStatus={
                openStatusConfirmation
              }
            />
          )}
        </section>
      </div>

      <UserDrawer
        user={
          selectedUser
        }
        updatingStatus={
          updatingStatus
        }
        onClose={
          handleCloseDrawer
        }
        onBlockUser={
          openStatusConfirmation
        }
        onUnblockUser={
          openStatusConfirmation
        }
      />

      <ConfirmDialog
        isOpen={
          pendingConfirmation !==
          null
        }
        title={
          isBlocking
            ? "Bloquear usuario"
            : "Desbloquear usuario"
        }
        message={
          isBlocking
            ? `¿Confirmas que deseas bloquear la cuenta de ${confirmationName}? El usuario no podrá iniciar sesión hasta que su cuenta sea desbloqueada.`
            : `¿Confirmas que deseas desbloquear la cuenta de ${confirmationName}? El usuario podrá volver a iniciar sesión según el estado de verificación de su correo.`
        }
        confirmText={
          isBlocking
            ? "Bloquear"
            : "Desbloquear"
        }
        cancelText="Cancelar"
        isProcessing={
          updatingStatus
        }
        variant={
          isBlocking
            ? "danger"
            : "primary"
        }
        onCancel={
          closeStatusConfirmation
        }
        onConfirm={() => {
          void confirmStatusChange();
        }}
      />
    </>
  );
};

export default UserManager;