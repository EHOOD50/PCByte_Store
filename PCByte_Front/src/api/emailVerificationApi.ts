import api from "./axios";

import type {
  UserStatus,
} from "../types/auth";

export interface ResendVerificationRequest {
  email: string;
}

export interface EmailVerificationResponse {
  verified: boolean;
  message: string;
  status: UserStatus | null;
}

export async function resendVerificationEmail(
  email: string
): Promise<EmailVerificationResponse> {
  const response =
    await api.post<EmailVerificationResponse>(
      "/auth/resend-verification",
      {
        email:
          email
            .trim()
            .toLowerCase(),
      }
    );

  return response.data;
}

export async function verifyEmailToken(
  token: string
): Promise<EmailVerificationResponse> {
  const normalizedToken =
    token.trim();

  if (!normalizedToken) {
    throw new Error(
      "El token de verificación es obligatorio."
    );
  }

  const response =
    await api.get<EmailVerificationResponse>(
      "/auth/verify-email",
      {
        params: {
          token:
            normalizedToken,
        },
      }
    );

  return response.data;
}