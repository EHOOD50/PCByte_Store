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

  /*
   * Valor final enviado al backend.
   *
   * Ejemplos:
   * "Departamento 1203"
   * "Torre B"
   * "Parcela 7"
   */
  apartment?: string;

  city?: string;
  region?: string;

  /*
   * Referencia libre para facilitar el despacho.
   *
   * Ejemplo:
   * "Alameda entre Maipú y Chacabuco"
   */
  extraInfo?: string;

  /*
   * Campos usados únicamente por el formulario.
   * Antes de enviar la solicitud se combinan
   * para construir apartment.
   */
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

  logout: () => void;
}