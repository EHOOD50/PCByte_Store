export type UserStatus =
  | "INVITADO"
  | "PENDIENTE_VERIFICACION"
  | "REGISTRADO"
  | "BLOQUEADO";

export interface AuthUser {
  id: number;

  firstName: string;
  lastName: string;

  email: string;

  phone?: string | null;

  status: UserStatus;
}

export interface AuthSession {
  user: AuthUser;
  authToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;

  email: string;
  password: string;

  phone?: string;

  addressLabel?: string;

  street?: string;
  number?: string;

  apartment?: string;

  city?: string;
  region?: string;

  extraInfo?: string;

  complementType?: string;
  complementDetail?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;

  authToken: string | null;

  isAuthenticated: boolean;
  isLoadingAuth: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<AuthUser>;

  register: (
    request: RegisterRequest
  ) => Promise<AuthUser>;

  updateUser: (
    updatedUser: AuthUser
  ) => void;

  /*
   * Sustituye el token Basic de la sesión actual
   * sin modificar los datos del usuario.
   *
   * Se utiliza después de cambiar la contraseña.
   */
  updateAuthToken: (
    newAuthToken: string
  ) => void;

  logout: () => void;
}