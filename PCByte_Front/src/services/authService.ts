import api from "../api/axios";

import type {
  AuthSession,
  AuthUser,
  RegisterRequest,
} from "../types/auth";

const normalizeEmail = (
  email: string
): string => {
  return email
    .trim()
    .toLowerCase();
};

export const authService = {
  /*
   * Registra una nueva cuenta o convierte
   * un usuario invitado en registrado.
   */
  register: async (
    userData: RegisterRequest
  ): Promise<AuthUser> => {
    const response =
      await api.post<AuthUser>(
        "/auth/register",
        {
          ...userData,

          email:
            normalizeEmail(
              userData.email
            ),
        }
      );

    return response.data;
  },

  /*
   * Inicia sesión mediante Basic Auth.
   *
   * El token generado se conserva en AuthContext
   * y localStorage.
   */
  login: async (
    email: string,
    password: string
  ): Promise<AuthSession> => {
    const normalizedEmail =
      normalizeEmail(email);

    const authToken =
      btoa(
        `${normalizedEmail}:${password}`
      );

    const response =
      await api.post<AuthUser>(
        "/auth/login",
        {},
        {
          headers: {
            Authorization:
              `Basic ${authToken}`,
          },
        }
      );

    return {
      user:
        response.data,

      authToken,
    };
  },
};