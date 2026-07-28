import axios from "axios";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  LogIn,
  MailCheck,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import logo from "../assets/logo.png";

import {
  verifyEmailToken,
} from "../api/emailVerificationApi";

type VerificationState =
  | "loading"
  | "success"
  | "expired"
  | "already-used"
  | "invalid"
  | "error";

interface VerificationViewData {
  state: VerificationState;
  title: string;
  message: string;
}

const initialView: VerificationViewData = {
  state: "loading",
  title: "Verificando tu correo",
  message:
    "Estamos validando el enlace de activación de tu Cuenta PCByte.",
};

const VerifyEmailPage = () => {
  const navigate =
    useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const token =
    searchParams
      .get("token")
      ?.trim() ?? "";

  const [
    view,
    setView,
  ] =
    useState<VerificationViewData>(
      initialView
    );

  /*
   * React StrictMode ejecuta los efectos dos veces
   * durante desarrollo.
   *
   * Esta referencia evita consumir dos veces
   * el mismo token de uso único.
   */
  const verificationStarted =
    useRef(false);

  useEffect(() => {
    if (
      verificationStarted.current
    ) {
      return;
    }

    verificationStarted.current =
      true;

    if (!token) {
      setView({
        state: "invalid",
        title:
          "Enlace de verificación inválido",
        message:
          "El enlace no contiene un token de activación válido.",
      });

      return;
    }

    const executeVerification =
      async () => {
        try {
          const response =
            await verifyEmailToken(
              token
            );

          if (
            response.verified
          ) {
            setView({
              state:
                "success",
              title:
                "Correo verificado correctamente",
              message:
                response.message ||
                "Tu Cuenta PCByte ya se encuentra activa y puedes iniciar sesión.",
            });

            return;
          }

          setView({
            state: "error",
            title:
              "No pudimos activar tu cuenta",
            message:
              response.message ||
              "No fue posible completar la verificación del correo.",
          });
        } catch (
          verificationError
        ) {
          console.error(
            "No fue posible verificar el correo:",
            verificationError
          );

          setView(
            resolveVerificationError(
              verificationError
            )
          );
        }
      };

    void executeVerification();
  }, [
    token,
  ]);

  const isLoading =
    view.state ===
    "loading";

  const isSuccess =
    view.state ===
    "success";

  const canRequestAnotherLink =
    view.state ===
      "expired" ||
    view.state ===
      "invalid" ||
    view.state ===
      "already-used";

  return (
<main className="min-h-screen w-full flex-1 bg-gradient-to-br from-white via-[#f8fbff] to-[#f7fbef] px-5 py-8 text-slate-900 sm:px-8 lg:px-12">      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center">
        <section className="w-full overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.11)]">
          <header className="border-b border-slate-100 bg-gradient-to-r from-[#f7fbef] via-white to-[#f3f7ff] px-6 py-5 sm:px-8">
            <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
              <img
                src={logo}
                alt="PCByte"
                className="h-auto w-48 object-contain sm:w-56"
              />

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/productos"
                  )
                }
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-[9px] font-black uppercase tracking-wider text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                <ArrowLeft
                  size={16}
                />

                Volver al catálogo
              </button>
            </div>
          </header>

          <div className="px-6 py-10 sm:px-10 sm:py-12">
            <div className="mx-auto max-w-2xl text-center">
              <VerificationIcon
                state={
                  view.state
                }
              />

              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
                Seguridad de la cuenta
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {view.title}
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
                {view.message}
              </p>
            </div>

            {isLoading && (
              <div className="mx-auto mt-8 flex max-w-lg items-center justify-center gap-3 rounded-2xl border border-[#0066FF]/20 bg-[#0066FF]/5 px-5 py-5">
                <Loader2
                  size={22}
                  className="animate-spin text-[#0066FF]"
                />

                <p className="text-sm font-bold text-slate-700">
                  Procesando el enlace de activación...
                </p>
              </div>
            )}

            {isSuccess && (
              <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                <InformationItem
                  icon={
                    <CheckCircle2
                      size={18}
                    />
                  }
                  title="Cuenta activada"
                  description="Tu correo ya fue confirmado."
                />

                <InformationItem
                  icon={
                    <ShieldCheck
                      size={18}
                    />
                  }
                  title="Acceso habilitado"
                  description="Ya puedes ingresar a Mi Cuenta."
                />

                <InformationItem
                  icon={
                    <MailCheck
                      size={18}
                    />
                  }
                  title="Correo validado"
                  description="Recibirás pedidos y notificaciones."
                />
              </div>
            )}

            {!isLoading &&
              !isSuccess && (
                <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                  <div className="flex items-start gap-3">
                    <Clock3
                      size={19}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>
                      <p className="text-sm font-black text-amber-800">
                        El enlace no pudo utilizarse
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        Puedes solicitar otro enlace desde la pantalla de registro utilizando nuevamente el mismo correo.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-center">
              {isSuccess && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/login",
                      {
                        replace:
                          true,
                      }
                    )
                  }
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-7 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
                >
                  <LogIn
                    size={17}
                  />

                  Iniciar sesión
                </button>
              )}

              {canRequestAnotherLink && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/register",
                      {
                        replace:
                          true,
                      }
                    )
                  }
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#97cf00] px-7 text-xs font-black uppercase text-slate-900 transition hover:bg-[#86b900]"
                >
                  <RefreshCw
                    size={17}
                  />

                  Solicitar otro enlace
                </button>
              )}

              {!isLoading && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/productos"
                    )
                  }
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <ArrowLeft
                    size={17}
                  />

                  Ir al catálogo
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

interface VerificationIconProps {
  state: VerificationState;
}

const VerificationIcon = ({
  state,
}: VerificationIconProps) => {
  if (
    state === "loading"
  ) {
    return (
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#0066FF]/10 text-[#0066FF]">
        <Loader2
          size={38}
          className="animate-spin"
        />
      </div>
    );
  }

  if (
    state === "success"
  ) {
    return (
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#97cf00]/15 text-[#6f9900]">
        <CheckCircle2
          size={40}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-amber-50 text-amber-600">
      <AlertCircle
        size={40}
      />
    </div>
  );
};

interface InformationItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const InformationItem = ({
  icon,
  title,
  description,
}: InformationItemProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0066FF] shadow-sm">
        {icon}
      </div>

      <p className="mt-3 text-xs font-black text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-[11px] leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
};

const resolveVerificationError = (
  error: unknown
): VerificationViewData => {
  if (
    axios.isAxiosError(error)
  ) {
    const responseData =
      error.response?.data;

    const data =
      responseData &&
      typeof responseData ===
        "object"
        ? responseData as Record<
            string,
            unknown
          >
        : null;

    const message =
      typeof data?.message ===
        "string" &&
      data.message.trim()
        ? data.message
        : null;

    const details =
      data?.details &&
      typeof data.details ===
        "object"
        ? data.details as Record<
            string,
            unknown
          >
        : null;

    const code =
      typeof details?.code ===
        "string"
        ? details.code
        : "";

    if (
      code ===
        "TOKEN_EXPIRED" ||
      error.response?.status ===
        410
    ) {
      return {
        state: "expired",
        title:
          "El enlace ha vencido",
        message:
          message ||
          "Este enlace de verificación ya superó su periodo de vigencia.",
      };
    }

    if (
      code ===
        "TOKEN_ALREADY_USED" ||
      code ===
        "ACCOUNT_ALREADY_ACTIVE"
    ) {
      return {
        state:
          "already-used",
        title:
          "El enlace ya fue utilizado",
        message:
          message ||
          "La cuenta podría encontrarse activada. Intenta iniciar sesión.",
      };
    }

    if (
      code ===
        "TOKEN_INVALIDATED"
    ) {
      return {
        state: "invalid",
        title:
          "El enlace fue reemplazado",
        message:
          message ||
          "Se solicitó un enlace más reciente. Utiliza el último correo recibido.",
      };
    }

    if (
      code ===
        "TOKEN_INVALID" ||
      code ===
        "TOKEN_PURPOSE_MISMATCH" ||
      error.response?.status ===
        400
    ) {
      return {
        state: "invalid",
        title:
          "El enlace no es válido",
        message:
          message ||
          "No pudimos reconocer este enlace de verificación.",
      };
    }

    return {
      state: "error",
      title:
        "No pudimos verificar tu correo",
      message:
        message ||
        "Ocurrió un problema al activar la cuenta. Inténtalo nuevamente más tarde.",
    };
  }

  return {
    state: "error",
    title:
      "No pudimos verificar tu correo",
    message:
      "No fue posible conectar con PCByte. Comprueba tu conexión e inténtalo nuevamente.",
  };
};

export default VerifyEmailPage;