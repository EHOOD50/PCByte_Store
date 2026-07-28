import axios from "axios";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  LogIn,
  Mail,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../assets/logo.png";

import {
  resendVerificationEmail,
} from "../api/emailVerificationApi";

interface VerificationPendingLocationState {
  email?: string;
  destination?: string;
}

const RESEND_COOLDOWN_SECONDS =
  60;

const EmailVerificationPendingPage =
  () => {
    const navigate =
      useNavigate();

    const location =
      useLocation();

    const state =
      location.state as
        | VerificationPendingLocationState
        | null;

    const email =
      state?.email
        ?.trim()
        .toLowerCase() ?? "";

    const destination =
      state?.destination &&
      state.destination !==
        "/register"
        ? state.destination
        : "/productos";

    const [
      remainingSeconds,
      setRemainingSeconds,
    ] = useState(
      RESEND_COOLDOWN_SECONDS
    );

    const [
      isResending,
      setIsResending,
    ] = useState(false);

    const [
      successMessage,
      setSuccessMessage,
    ] = useState<string | null>(
      null
    );

    const [
      errorMessage,
      setErrorMessage,
    ] = useState<string | null>(
      null
    );

    useEffect(() => {
      if (
        remainingSeconds <= 0
      ) {
        return;
      }

      const timer =
        window.setInterval(
          () => {
            setRemainingSeconds(
              (current) =>
                Math.max(
                  current - 1,
                  0
                )
            );
          },
          1000
        );

      return () => {
        window.clearInterval(
          timer
        );
      };
    }, [
      remainingSeconds,
    ]);

    const handleResend =
      async () => {
        if (
          !email ||
          remainingSeconds > 0 ||
          isResending
        ) {
          return;
        }

        try {
          setIsResending(true);
          setSuccessMessage(null);
          setErrorMessage(null);

          const response =
            await resendVerificationEmail(
              email
            );

          setSuccessMessage(
            response.message
          );

          setRemainingSeconds(
            RESEND_COOLDOWN_SECONDS
          );
        } catch (
          resendError
        ) {
          console.error(
            "No fue posible reenviar el correo:",
            resendError
          );

          setErrorMessage(
            getErrorMessage(
              resendError
            )
          );
        } finally {
          setIsResending(false);
        }
      };

    const handleGoToLogin =
      () => {
        navigate(
          "/login",
          {
            replace: true,
            state: {
              from:
                destination,
            },
          }
        );
      };

    const maskedEmail =
      maskEmail(
        email
      );

    return (
<main className="min-h-screen w-full flex-1 bg-gradient-to-br from-white via-[#f8fbff] to-[#f7fbef] px-5 py-8 text-slate-900 sm:px-8 lg:px-12">        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center">
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

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#0066FF]/10 text-[#0066FF]">
                  <Mail
                    size={38}
                  />
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
                  Verificación de correo
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Revisa tu correo electrónico
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500">
                  Tu Cuenta PCByte fue creada, pero todavía debes verificar que tienes acceso al correo registrado antes de iniciar sesión.
                </p>

                {email ? (
                  <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-[#0066FF]/20 bg-[#0066FF]/5 px-5 py-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                      Enlace enviado a
                    </p>

                    <p className="mt-2 break-all text-base font-black text-slate-900">
                      {maskedEmail}
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-700">
                    No pudimos recuperar el correo del registro. Puedes volver al formulario y solicitar un nuevo enlace.
                  </div>
                )}
              </div>

              {successMessage && (
                <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-[#97cf00]/40 bg-[#97cf00]/10 px-5 py-4">
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-[#6f9900]"
                  />

                  <p className="text-sm font-bold leading-6 text-[#527200]">
                    {successMessage}
                  </p>
                </div>
              )}

              {errorMessage && (
                <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold leading-6 text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-3">
                <InformationItem
                  icon={
                    <Mail
                      size={18}
                    />
                  }
                  title="Revisa tu bandeja"
                  description="Busca el correo enviado por PCByte."
                />

                <InformationItem
                  icon={
                    <ShieldCheck
                      size={18}
                    />
                  }
                  title="Revisa Spam"
                  description="El mensaje puede llegar a correo no deseado."
                />

                <InformationItem
                  icon={
                    <Clock3
                      size={18}
                    />
                  }
                  title="Vigencia de 24 horas"
                  description="Después podrás solicitar un enlace nuevo."
                />
              </div>

              <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => {
                    void handleResend();
                  }}
                  disabled={
                    !email ||
                    isResending ||
                    remainingSeconds > 0
                  }
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#97cf00]/60 bg-[#97cf00]/10 px-6 text-xs font-black uppercase text-[#527200] transition hover:bg-[#97cf00]/20 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {isResending ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Reenviando...
                    </>
                  ) : (
                    <>
                      <RefreshCw
                        size={17}
                      />

                      {remainingSeconds >
                      0
                        ? `Reenviar en ${remainingSeconds}s`
                        : "Reenviar correo"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    handleGoToLogin
                  }
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-6 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
                >
                  <LogIn
                    size={17}
                  />

                  Ir a iniciar sesión
                </button>
              </div>

              <p className="mx-auto mt-5 max-w-xl text-center text-xs leading-5 text-slate-400">
                Aunque puedes visitar la página de acceso, no podrás iniciar sesión hasta utilizar el enlace enviado a tu correo.
              </p>
            </div>
          </section>
        </div>
      </main>
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

const maskEmail = (
  email: string
): string => {
  if (
    !email ||
    !email.includes("@")
  ) {
    return email;
  }

  const [
    localPart,
    domain,
  ] =
    email.split(
      "@",
      2
    );

  if (
    localPart.length <= 2
  ) {
    return `${localPart.charAt(
      0
    )}***@${domain}`;
  }

  return `${localPart.slice(
    0,
    2
  )}***@${domain}`;
};

const getErrorMessage = (
  error: unknown
): string => {
  if (
    axios.isAxiosError(error)
  ) {
    const responseData =
      error.response?.data;

    if (
      responseData &&
      typeof responseData ===
        "object"
    ) {
      const data =
        responseData as Record<
          string,
          unknown
        >;

      if (
        typeof data.message ===
          "string" &&
        data.message.trim()
      ) {
        return data.message;
      }
    }

    if (
      error.response?.status ===
      429
    ) {
      return "Debes esperar antes de solicitar otro correo de verificación.";
    }
  }

  return "No fue posible reenviar el correo. Inténtalo nuevamente más tarde.";
};

export default EmailVerificationPendingPage;