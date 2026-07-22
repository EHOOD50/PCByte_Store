import axios from "axios";

import type {
  AuthSession,
  AuthUser,
  RegisterRequest,
} from "../types/auth";

const API_URL =
  "https://unrarefied-unpervasive-pandora.ngrok-free.dev/api/auth";

const normalizeEmail = (
  email: string
): string => {
  return email.trim().toLowerCase();
};

export const authService = {
  register: async (
    userData: RegisterRequest
  ): Promise<AuthUser> => {
    const response =
      await axios.post<AuthUser>(
        `${API_URL}/register`,
        {
          ...userData,
          email: normalizeEmail(
            userData.email
          ),
        }
      );

    return response.data;
  },

  login: async (
    email: string,
    password: string
  ): Promise<AuthSession> => {
    const normalizedEmail =
      normalizeEmail(email);

    const authToken = btoa(
      `${normalizedEmail}:${password}`
    );

    const response =
      await axios.post<AuthUser>(
        `${API_URL}/login`,
        {},
        {
          headers: {
            Authorization:
              `Basic ${authToken}`,
          },
        }
      );

    return {
      user: response.data,
      authToken,
    };
  },
};