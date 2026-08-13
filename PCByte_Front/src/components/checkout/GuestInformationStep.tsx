import React, {
  useState,
} from "react";

import {
  ArrowRight,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  Mail,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  sendGuestVerificationCode,
  verifyGuestVerificationCode,
} from "../../api/emailVerificationApi";

export interface GuestInformationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface GuestInformationStepProps {
  data: GuestInformationData;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onContinue: () => void;

  requiresEmailVerification?: boolean;

  verifiedEmail: string | null;

  onVerifiedEmailChange: (
    email: string | null
  ) => void;
}

const normalizeEmail = (
  email: string
): string => {
  return email
    .trim()
    .toLowerCase();
};

const isValidEmail = (
  email: string
): boolean => {
  const normalizedEmail =
    normalizeEmail(
      email
    );

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    normalizedEmail
  );
};

const getRequestErrorMessage = (
  requestError: unknown,
  fallbackMessage: string
): string => {
  if (
    typeof requestError ===
      "object" &&
    requestError !== null &&
    "response" in requestError
  ) {
    const axiosError =
      requestError as {
        response?: {
          data?:
            | {
                message?: string;
              }
            | string;
        };
      };

    const responseData =
      axiosError.response
        ?.data;

    if (
      typeof responseData ===
      "string" &&
      responseData.trim()
    ) {
      return responseData;
    }

    if (
      typeof responseData ===
        "object" &&
      responseData !== null &&
      typeof responseData.message ===
        "string" &&
      responseData.message.trim()
    ) {
      return responseData.message;
    }
  }

  if (
    requestError instanceof
      Error &&
    requestError.message
      .trim()
  ) {
    return requestError.message;
  }

  return fallbackMessage;
};

export const GuestInformationStep = ({
  data,
  onChange,
  onContinue,
  requiresEmailVerification = false,
  verifiedEmail,
  onVerifiedEmailChange,
}: GuestInformationStepProps) => {
  const [
    verificationCode,
    setVerificationCode,
  ] = useState("");

  const [
    codeSentToEmail,
    setCodeSentToEmail,
  ] = useState<string | null>(
    null
  );

  const [
    isSendingCode,
    setIsSendingCode,
  ] = useState(false);

  const [
    isVerifyingCode,
    setIsVerifyingCode,
  ] = useState(false);

  const [
    verificationMessage,
    setVerificationMessage,
  ] = useState("");

  const [
    verificationError,
    setVerificationError,
  ] = useState("");

  const normalizedEmail =
    normalizeEmail(
      data.email
    );

  /*
   * La verificación siempre queda asociada
   * al correo exacto que fue comprobado.
   *
   * Si el cliente cambia el correo después
   * de verificarlo, deja automáticamente de
   * considerarse verificado.
   */
  const emailIsVerified =
    !requiresEmailVerification ||
    (
      verifiedEmail !==
        null &&
      verifiedEmail ===
        normalizedEmail
    );

  const codeWasSentForCurrentEmail =
    codeSentToEmail !==
      null &&
    codeSentToEmail ===
      normalizedEmail;

  const informationIsComplete =
    data.firstName
      .trim() !==
      "" &&
    data.lastName
      .trim() !==
      "" &&
    normalizedEmail !==
      "" &&
    data.phone
      .trim() !==
      "";

  const isValid =
    informationIsComplete &&
    emailIsVerified;

  const handleEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextEmail =
      normalizeEmail(
        event.target.value
      );

    /*
     * Si el correo cambia, cualquier código
     * visible pertenece a la identidad anterior.
     *
     * No eliminamos verifiedEmail.
     * De esta manera, si el cliente vuelve
     * al correo ya verificado durante este
     * checkout, recuperará su verificación.
     */
    if (
      nextEmail !==
      normalizedEmail
    ) {
      setVerificationCode(
        ""
      );

      setVerificationMessage(
        ""
      );

      setVerificationError(
        ""
      );
    }

    onChange(
      event
    );
  };

  const handleSendCode =
    async () => {
      if (
        !isValidEmail(
          data.email
        )
      ) {
        setVerificationError(
          "Ingresa un correo electrónico válido antes de solicitar el código."
        );

        setVerificationMessage(
          ""
        );

        return;
      }

      setIsSendingCode(
        true
      );

      setVerificationError(
        ""
      );

      setVerificationMessage(
        ""
      );

      try {
        const response =
          await sendGuestVerificationCode(
            normalizedEmail
          );

        setCodeSentToEmail(
          normalizedEmail
        );

        /*
         * Al emitir un código nuevo para este
         * correo, la verificación anterior deja
         * de considerarse válida dentro del flujo.
         */
        onVerifiedEmailChange(
          null
        );

        setVerificationCode(
          ""
        );

        setVerificationMessage(
          response.message ||
            "Se envió un código de verificación al correo indicado."
        );
      } catch (
        requestError: unknown
      ) {
        console.error(
          "Error al enviar código de verificación:",
          requestError
        );

        setVerificationError(
          getRequestErrorMessage(
            requestError,
            "No fue posible enviar el código de verificación."
          )
        );
      } finally {
        setIsSendingCode(
          false
        );
      }
    };

  const handleCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const numericValue =
      event.target.value
        .replace(
          /\D/g,
          ""
        )
        .slice(
          0,
          6
        );

    setVerificationCode(
      numericValue
    );

    setVerificationError(
      ""
    );
  };

  const handleVerifyCode =
    async () => {
      if (
        !codeWasSentForCurrentEmail
      ) {
        setVerificationError(
          "Solicita un código para este correo antes de verificarlo."
        );

        return;
      }

      if (
        verificationCode.length !==
        6
      ) {
        setVerificationError(
          "Ingresa el código de 6 dígitos que enviamos a tu correo."
        );

        return;
      }

      setIsVerifyingCode(
        true
      );

      setVerificationError(
        ""
      );

      setVerificationMessage(
        ""
      );

      try {
        const response =
          await verifyGuestVerificationCode(
            normalizedEmail,
            verificationCode
          );

        if (
          !response.verified
        ) {
          setVerificationError(
            response.message ||
              "No fue posible verificar el correo."
          );

          return;
        }

        /*
         * Guardamos en CheckoutPage el correo
         * exacto que acaba de ser verificado.
         */
        onVerifiedEmailChange(
          normalizedEmail
        );

        setVerificationMessage(
          response.message ||
            "Correo verificado correctamente."
        );

        setVerificationCode(
          ""
        );
      } catch (
        requestError: unknown
      ) {
        console.error(
          "Error al verificar código:",
          requestError
        );

        setVerificationError(
          getRequestErrorMessage(
            requestError,
            "El código ingresado no pudo ser verificado."
          )
        );
      } finally {
        setIsVerifyingCode(
          false
        );
      }
    };

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
          <UserRound
            size={21}
          />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
            Paso 1
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Datos del comprador
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            Ingresa los datos necesarios para identificar tu compra y
            mantenerte informado sobre el pedido.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          icon={
            <UserRound
              size={17}
            />
          }
          label="Nombre(s)"
          name="firstName"
          value={
            data.firstName
          }
          placeholder="Ej.: Esteban"
          autoComplete="given-name"
          onChange={
            onChange
          }
          required
        />

        <InputField
          icon={
            <UserRound
              size={17}
            />
          }
          label="Apellido(s)"
          name="lastName"
          value={
            data.lastName
          }
          placeholder="Ej.: Hood"
          autoComplete="family-name"
          onChange={
            onChange
          }
          required
        />

        <InputField
          icon={
            <Mail
              size={17}
            />
          }
          label="Correo electrónico"
          name="email"
          type="email"
          value={
            data.email
          }
          placeholder="nombre@correo.cl"
          autoComplete="email"
          onChange={
            requiresEmailVerification
              ? handleEmailChange
              : onChange
          }
          required
        />

        <InputField
          icon={
            <Phone
              size={17}
            />
          }
          label="Teléfono"
          name="phone"
          type="tel"
          value={
            data.phone
          }
          placeholder="+56 9 1234 5678"
          autoComplete="tel"
          onChange={
            onChange
          }
          required
        />
      </div>

      {requiresEmailVerification && (
        <div className="mt-5 rounded-2xl border border-[#0066FF]/15 bg-[#f7faff] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                emailIsVerified
                  ? "bg-[#97cf00]/15 text-[#6f9900]"
                  : "bg-[#0066FF]/10 text-[#0066FF]"
              }`}
            >
              {emailIsVerified ? (
                <CheckCircle2
                  size={20}
                />
              ) : (
                <ShieldCheck
                  size={20}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                Verificación de correo
              </p>

              {emailIsVerified ? (
                <>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    Correo verificado
                  </p>

                  <p className="mt-1 break-all text-xs leading-5 text-slate-500">
                    Confirmamos que tienes acceso a{" "}
                    <span className="font-bold text-slate-700">
                      {normalizedEmail}
                    </span>
                    .
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-1 text-sm font-black text-slate-900">
                    Confirma tu correo antes de continuar
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Te enviaremos un código de 6 dígitos para confirmar
                    que el correo pertenece a ti.
                  </p>
                </>
              )}
            </div>
          </div>

          {!emailIsVerified && (
            <>
              {!codeWasSentForCurrentEmail ? (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={
                      handleSendCode
                    }
                    disabled={
                      isSendingCode ||
                      !isValidEmail(
                        data.email
                      )
                    }
                    className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-[10px] font-black uppercase text-white transition hover:bg-[#0055d4] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
                  >
                    {isSendingCode ? (
                      <>
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />

                        Enviando código
                      </>
                    ) : (
                      <>
                        <Send
                          size={16}
                        />

                        Enviar código
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-start gap-3">
                      <Mail
                        size={17}
                        className="mt-0.5 shrink-0 text-[#0066FF]"
                      />

                      <div className="min-w-0">
                        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          Código enviado a
                        </p>

                        <p className="mt-1 break-all text-xs font-bold text-slate-700">
                          {codeSentToEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                        Código de 6 dígitos
                      </label>

                      <div className="relative mt-1.5">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                          <KeyRound
                            size={17}
                          />
                        </div>

                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          value={
                            verificationCode
                          }
                          onChange={
                            handleCodeChange
                          }
                          placeholder="000000"
                          maxLength={6}
                          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-center text-lg font-black tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#0066FF]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleVerifyCode
                      }
                      disabled={
                        isVerifyingCode ||
                        verificationCode.length !==
                          6
                      }
                      className="flex min-h-[48px] items-center justify-center gap-2 self-end rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase text-white transition hover:bg-[#0066FF] disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isVerifyingCode ? (
                        <>
                          <LoaderCircle
                            size={16}
                            className="animate-spin"
                          />

                          Verificando
                        </>
                      ) : (
                        <>
                          <ShieldCheck
                            size={16}
                          />

                          Verificar
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={
                        handleSendCode
                      }
                      disabled={
                        isSendingCode
                      }
                      className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-[#0066FF] transition hover:text-[#0055d4] disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                      {isSendingCode ? (
                        <LoaderCircle
                          size={13}
                          className="animate-spin"
                        />
                      ) : (
                        <RefreshCw
                          size={13}
                        />
                      )}

                      Reenviar código
                    </button>
                  </div>
                </div>
              )}

              {verificationError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-600">
                  {verificationError}
                </div>
              )}

              {verificationMessage && (
                <div className="mt-4 rounded-xl border border-[#97cf00]/25 bg-[#97cf00]/5 px-4 py-3 text-xs font-bold leading-5 text-[#5f8200]">
                  {verificationMessage}
                </div>
              )}
            </>
          )}

          {emailIsVerified &&
            verificationMessage && (
              <div className="mt-4 rounded-xl border border-[#97cf00]/25 bg-[#97cf00]/5 px-4 py-3 text-xs font-bold leading-5 text-[#5f8200]">
                {verificationMessage}
              </div>
            )}
        </div>
      )}

      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={
            onContinue
          }
          disabled={
            !isValid
          }
          className="group flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-7 text-xs font-black uppercase text-white transition hover:bg-[#0066FF] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          Continuar a dirección

          <ArrowRight
            size={18}
            className="text-[#97cf00] transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </section>
  );
};

interface InputFieldProps {
  name:
    keyof GuestInformationData;

  value: string;

  label: string;

  placeholder: string;

  icon?: React.ReactNode;

  type?:
    React.HTMLInputTypeAttribute;

  autoComplete?: string;

  required?: boolean;

  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const InputField = ({
  name,
  value,
  label,
  placeholder,
  icon,
  type = "text",
  autoComplete,
  required = false,
  onChange,
}: InputFieldProps) => {
  return (
    <div>
      <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">
        {label}
      </label>

      <div className="relative mt-1.5">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
            {icon}
          </div>
        )}

        <input
          name={
            name
          }
          type={
            type
          }
          value={
            value
          }
          placeholder={
            placeholder
          }
          autoComplete={
            autoComplete
          }
          required={
            required
          }
          onChange={
            onChange
          }
          className={`h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:border-[#0066FF] focus:bg-white ${
            icon
              ? "pl-11"
              : "pl-4"
          }`}
        />
      </div>
    </div>
  );
};

export default GuestInformationStep;