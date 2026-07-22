import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authService } from "../services/authService";

import type {
  AuthContextValue,
  AuthUser,
  RegisterRequest,
} from "../types/auth";

const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "auth_token";

export const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [authToken, setAuthToken] =
    useState<string | null>(null);

  const [isLoadingAuth, setIsLoadingAuth] =
    useState(true);

  /*
   * Recupera la sesión almacenada al iniciar la aplicación.
   */
  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem(
          USER_STORAGE_KEY
        );

      const storedToken =
        localStorage.getItem(
          TOKEN_STORAGE_KEY
        );

      if (
        !storedUser ||
        !storedToken
      ) {
        return;
      }

      const parsedUser =
        JSON.parse(
          storedUser
        ) as AuthUser;

      const isValidUser =
        typeof parsedUser.id ===
          "number" &&
        typeof parsedUser.email ===
          "string" &&
        parsedUser.status ===
          "REGISTRADO";

      if (!isValidUser) {
        clearStoredSession();
        return;
      }

      setUser(parsedUser);
      setAuthToken(storedToken);
    } catch (error) {
      console.error(
        "No fue posible recuperar la sesión:",
        error
      );

      clearStoredSession();
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  /*
   * Inicia sesión y conserva los datos del cliente.
   */
  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<AuthUser> => {
      const session =
        await authService.login(
          email,
          password
        );

      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(
          session.user
        )
      );

      localStorage.setItem(
        TOKEN_STORAGE_KEY,
        session.authToken
      );

      setUser(session.user);
      setAuthToken(
        session.authToken
      );

      return session.user;
    },
    []
  );

  /*
   * Crea o convierte una cuenta.
   *
   * El registro no inicia sesión automáticamente.
   * Después del registro, el cliente debe autenticarse.
   */
  const register = useCallback(
    async (
      request: RegisterRequest
    ): Promise<AuthUser> => {
      return authService.register(
        request
      );
    },
    []
  );

  /*
   * Finaliza la sesión actual.
   */
  const logout =
    useCallback(() => {
      clearStoredSession();

      setUser(null);
      setAuthToken(null);
    }, []);

  const isAuthenticated =
    Boolean(
      user &&
        authToken &&
        user.status ===
          "REGISTRADO"
    );

  const contextValue =
    useMemo<AuthContextValue>(
      () => ({
        user,
        authToken,
        isAuthenticated,
        isLoadingAuth,
        login,
        register,
        logout,
      }),
      [
        user,
        authToken,
        isAuthenticated,
        isLoadingAuth,
        login,
        register,
        logout,
      ]
    );

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};

const clearStoredSession = () => {
  localStorage.removeItem(
    USER_STORAGE_KEY
  );

  localStorage.removeItem(
    TOKEN_STORAGE_KEY
  );
};