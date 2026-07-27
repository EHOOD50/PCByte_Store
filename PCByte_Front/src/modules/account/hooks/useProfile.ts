import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getProfile,
  updateProfile,
  type UpdateProfileRequest,
} from "../../../api/profileApi";

import type {
  AuthUser,
} from "../../../types/auth";

interface UseProfileResult {
  profile: AuthUser | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveError: string | null;

  reloadProfile: (
    silent?: boolean
  ) => Promise<AuthUser | null>;

  saveProfile: (
    request: UpdateProfileRequest
  ) => Promise<AuthUser>;
}

export default function useProfile(
  authToken?: string | null
): UseProfileResult {
  const [
    profile,
    setProfile,
  ] = useState<AuthUser | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(
    null
  );

  const reloadProfile =
    useCallback(
      async (
        silent = false
      ): Promise<AuthUser | null> => {
        if (!authToken) {
          setProfile(null);
          setError(null);
          setLoading(false);

          return null;
        }

        try {
          if (!silent) {
            setLoading(true);
          }

          setError(null);

          const response =
            await getProfile(
              authToken
            );

          setProfile(response);

          return response;
        } catch (profileError) {
          console.error(
            "No fue posible obtener el perfil:",
            profileError
          );

          setError(
            "No fue posible obtener los datos de tu perfil."
          );

          return null;
        } finally {
          if (!silent) {
            setLoading(false);
          }
        }
      },
      [
        authToken,
      ]
    );

  const saveProfile =
    useCallback(
      async (
        request: UpdateProfileRequest
      ): Promise<AuthUser> => {
        if (!authToken) {
          throw new Error(
            "No existe una sesión autenticada."
          );
        }

        try {
          setSaving(true);
          setSaveError(null);

          const response =
            await updateProfile(
              authToken,
              request
            );

          setProfile(response);

          return response;
        } catch (profileError) {
          console.error(
            "No fue posible actualizar el perfil:",
            profileError
          );

          setSaveError(
            "No fue posible guardar los cambios del perfil."
          );

          throw profileError;
        } finally {
          setSaving(false);
        }
      },
      [
        authToken,
      ]
    );

  useEffect(() => {
    void reloadProfile();
  }, [
    reloadProfile,
  ]);

  return {
    profile,
    loading,
    saving,
    error,
    saveError,
    reloadProfile,
    saveProfile,
  };
}