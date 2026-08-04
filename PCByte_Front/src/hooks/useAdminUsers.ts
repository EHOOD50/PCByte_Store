import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getUsers,
  updateUserStatus,
} from "../api/adminUsersApi";

import type {
  AdminUser,
  AdminUserStatus,
} from "../api/adminUsersApi";

export function useAdminUsers() {

  const [
    users,
    setUsers,
  ] =
    useState<AdminUser[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const reload =
    useCallback(
      async () => {

        try {

          setLoading(true);

          setError("");

          const data =
            await getUsers();

          setUsers(data);

        } catch {

          setError(
            "No fue posible cargar los usuarios."
          );

        } finally {

          setLoading(false);

        }

      },
      []
    );

  const changeStatus =
    useCallback(
      async (
        userId: number,
        status: AdminUserStatus
      ) => {

        const updatedUser =
          await updateUserStatus(
            userId,
            {
              status,
            }
          );

        setUsers(
          (
            currentUsers
          ) =>
            currentUsers.map(
              (
                user
              ) =>
                user.id ===
                updatedUser.id
                  ? updatedUser
                  : user
            )
        );

        return updatedUser;

      },
      []
    );

  useEffect(() => {

    void reload();

  }, [reload]);

  return {

    users,

    loading,

    error,

    reload,

    changeStatus,

  };

}