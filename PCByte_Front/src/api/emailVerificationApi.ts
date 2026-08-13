
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

export interface GuestVerificationCodeResponse {
  verified: boolean;
  message: string;
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

export async function sendGuestVerificationCode(
  email: string
): Promise<GuestVerificationCodeResponse> {
  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  if (!normalizedEmail) {
    throw new Error(
      "El correo electrónico es obligatorio."
    );
  }

  const response =
    await api.post<GuestVerificationCodeResponse>(
      "/verification/send-code",
      {
        email:
          normalizedEmail,
      }
    );

  return response.data;
}

export async function verifyGuestVerificationCode(
  email: string,
  code: string
): Promise<GuestVerificationCodeResponse> {
  const normalizedEmail =
    email
      .trim()
      .toLowerCase();

  const normalizedCode =
    code.trim();

  if (!normalizedEmail) {
    throw new Error(
      "El correo electrónico es obligatorio."
    );
  }

  if (!normalizedCode) {
    throw new Error(
      "El código de verificación es obligatorio."
    );
  }

  const response =
    await api.post<GuestVerificationCodeResponse>(
      "/verification/verify-code",
      {
        email:
          normalizedEmail,

        code:
          normalizedCode,
      }
    );

  return response.data;
}
