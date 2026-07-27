import api from "./axios";

import type {
  AuthUser,
} from "../types/auth";

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const createAuthConfig = (
  authToken: string
) => {
  return {
    headers: {
      Authorization:
        `Basic ${authToken}`,
    },
  };
};

export async function getProfile(
  authToken: string
): Promise<AuthUser> {
  const response =
    await api.get<AuthUser>(
      "/auth/profile",
      createAuthConfig(
        authToken
      )
    );

  return response.data;
}

export async function updateProfile(
  authToken: string,
  request: UpdateProfileRequest
): Promise<AuthUser> {
  const response =
    await api.put<AuthUser>(
      "/auth/profile",
      {
        firstName:
          request.firstName.trim(),

        lastName:
          request.lastName.trim(),

        phone:
          request.phone?.trim() ||
          null,
      },
      createAuthConfig(
        authToken
      )
    );

  return response.data;
}

/*
 * Cambia la contraseña usando el token Basic actual.
 *
 * Al finalizar, devuelve el nuevo token Basic generado
 * con el correo del usuario y la nueva contraseña.
 */
export async function changePassword(
  email: string,
  authToken: string,
  request: ChangePasswordRequest
): Promise<string> {
  await api.put(
    "/auth/change-password",
    {
      currentPassword:
        request.currentPassword,

      newPassword:
        request.newPassword,

      confirmPassword:
        request.confirmPassword,
    },
    createAuthConfig(
      authToken
    )
  );

  return btoa(
    `${email
      .trim()
      .toLowerCase()}:${request.newPassword}`
  );
}