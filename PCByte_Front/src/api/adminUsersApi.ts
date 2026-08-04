import adminApi from "./adminApi";

export type AdminUserRole =
  | "USER"
  | "ADMIN";

export type AdminUserStatus =
  | "INVITADO"
  | "EMAIL_PENDIENTE_VERIFICACION"
  | "REGISTRADO"
  | "BLOQUEADO";

export interface AdminUser {
  id: number;

  firstName: string;
  lastName: string;

  email: string;
  phone?: string | null;

  role: AdminUserRole;
  status: AdminUserStatus;

  emailVerified: boolean;

  createdAt: string;
  updatedAt: string;

  orderCount: number;
  addressCount: number;
}

export interface AdminUpdateUserStatusRequest {
  status: AdminUserStatus;
}

export async function getUsers(): Promise<AdminUser[]> {
  const response =
    await adminApi.get<AdminUser[]>(
      "/admin/users"
    );

  return response.data;
}

export async function updateUserStatus(
  userId: number,
  request: AdminUpdateUserStatusRequest
): Promise<AdminUser> {

  const response =
    await adminApi.patch<AdminUser>(
      `/admin/users/${userId}/status`,
      request
    );

  return response.data;
}