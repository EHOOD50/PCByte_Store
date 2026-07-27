import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Save,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import axios from "axios";

import {
  changePassword,
} from "../../../api/profileApi";

import {
  useAuth,
} from "../../../hooks/useAuth";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (
    message: string
  ) => void;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const emptyPasswordForm: PasswordFormData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const ChangePasswordModal = ({
  isOpen,
  onClose,
  onSuccess,
}: ChangePasswordModalProps) => {
  const {
    user,
    authToken,
    updateAuthToken,
  } = useAuth();

  const [
    formData,
    setFormData,
  ] = useState<PasswordFormData>({
    ...emptyPasswordForm,
  });

  const [
    showCurrentPassword,
    setShowCurrentPassword,
  ] = useState(false);

  const [
    showNewPassword,
    setShowNewPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );

  const passwordStrength =
    useMemo(
      () =>
        calculatePasswordStrength(
          formData.newPassword
        ),
      [
        formData.newPassword,
      ]
    );

  const passwordsMatch =
    formData.confirmPassword.length >
      0 &&
    formData.newPassword ===
      formData.confirmPassword;

  const canSubmit =
    formData.currentPassword.length >=
      8 &&
    formData.newPassword.length >=
      8 &&
    formData.newPassword.length <=
      72 &&
    passwordsMatch &&
    !isSaving;

  const resetModal = () => {
    setFormData({
      ...emptyPasswordForm,
    });

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    resetModal();
    onClose();
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentForm) => ({
        ...currentForm,
        [name]: value,
      })
    );

    setError(null);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !user?.email ||
      !authToken
    ) {
      setError(
        "No fue posible identificar la sesión actual."
      );

      return;
    }

    if (
      formData.currentPassword.length <
      8
    ) {
      setError(
        "La contraseña actual debe contener al menos 8 caracteres."
      );

      return;
    }

    if (
      formData.newPassword.length <
        8 ||
      formData.newPassword.length >
        72
    ) {
      setError(
        "La nueva contraseña debe contener entre 8 y 72 caracteres."
      );

      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setError(
        "La nueva contraseña y su confirmación no coinciden."
      );

      return;
    }

    if (
      formData.currentPassword ===
      formData.newPassword
    ) {
      setError(
        "La nueva contraseña debe ser diferente de la actual."
      );

      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const newAuthToken =
        await changePassword(
          user.email,
          authToken,
          {
            currentPassword:
              formData.currentPassword,

            newPassword:
              formData.newPassword,

            confirmPassword:
              formData.confirmPassword,
          }
        );

      updateAuthToken(
        newAuthToken
      );

      resetModal();
      onClose();

      onSuccess(
        "Tu contraseña fue actualizada correctamente. La sesión continúa activa."
      );
    } catch (passwordError) {
      console.error(
        "No fue posible cambiar la contraseña:",
        passwordError
      );

      setError(
        getPasswordErrorMessage(
          passwordError
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm"
    >
      <div className="mx-auto flex min-h-full w-full max-w-xl items-center justify-center py-4">
        <section className="relative w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            aria-label="Cerrar cambio de contraseña"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>

          <header className="flex items-start gap-4 border-b border-slate-100 pb-5 pr-12">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
              <KeyRound size={22} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#0066FF]">
                Seguridad de la cuenta
              </p>

              <h2
                id="change-password-title"
                className="mt-1 text-2xl font-black tracking-tight text-slate-900"
              >
                Cambiar contraseña
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                Confirma tu contraseña actual y define una nueva clave para tu Cuenta PCByte.
              </p>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="mt-6"
          >
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0 text-red-500"
                />

                <p className="text-sm font-bold leading-6 text-red-600">
                  {error}
                </p>
              </div>
            )}

            <PasswordInput
              label="Contraseña actual"
              name="currentPassword"
              value={
                formData.currentPassword
              }
              placeholder="Ingresa tu contraseña actual"
              visible={
                showCurrentPassword
              }
              disabled={isSaving}
              autoComplete="current-password"
              onChange={handleChange}
              onToggleVisibility={() =>
                setShowCurrentPassword(
                  (current) =>
                    !current
                )
              }
            />

            <div className="mt-5">
              <PasswordInput
                label="Nueva contraseña"
                name="newPassword"
                value={
                  formData.newPassword
                }
                placeholder="Entre 8 y 72 caracteres"
                visible={
                  showNewPassword
                }
                disabled={isSaving}
                autoComplete="new-password"
                onChange={handleChange}
                onToggleVisibility={() =>
                  setShowNewPassword(
                    (current) =>
                      !current
                  )
                }
              />
            </div>

            {formData.newPassword && (
              <PasswordStrengthPanel
                strength={
                  passwordStrength
                }
              />
            )}

            <div className="mt-5">
              <PasswordInput
                label="Confirmar nueva contraseña"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                placeholder="Repite la nueva contraseña"
                visible={
                  showConfirmPassword
                }
                disabled={isSaving}
                autoComplete="new-password"
                onChange={handleChange}
                onToggleVisibility={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
              />
            </div>

            {formData.confirmPassword && (
              <div
                className={`mt-3 flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold ${
                  passwordsMatch
                    ? "border-[#97cf00]/40 bg-[#97cf00]/10 text-[#527200]"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }`}
              >
                {passwordsMatch ? (
                  <CheckCircle2
                    size={16}
                    className="shrink-0"
                  />
                ) : (
                  <AlertCircle
                    size={16}
                    className="shrink-0"
                  />
                )}

                {passwordsMatch
                  ? "Las contraseñas coinciden."
                  : "Las contraseñas todavía no coinciden."}
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-[#0066FF]/15 bg-[#0066FF]/5 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-[#0066FF]"
                />

                <div>
                  <p className="text-sm font-black text-slate-800">
                    Recomendaciones de seguridad
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Usa una combinación difícil de adivinar y evita reutilizar claves de otras cuentas.
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                <SecurityRequirement
                  valid={
                    formData.newPassword
                      .length >= 8
                  }
                  label="Mínimo 8 caracteres"
                />

                <SecurityRequirement
                  valid={/[A-Z]/.test(
                    formData.newPassword
                  )}
                  label="Una letra mayúscula"
                />

                <SecurityRequirement
                  valid={/[a-z]/.test(
                    formData.newPassword
                  )}
                  label="Una letra minúscula"
                />

                <SecurityRequirement
                  valid={/\d/.test(
                    formData.newPassword
                  )}
                  label="Un número"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Cancelar
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#97cf00] px-5 text-xs font-black uppercase text-slate-900 transition hover:bg-[#86b900] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
              >
                {isSaving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Actualizando...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Cambiar contraseña
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

interface PasswordInputProps {
  label: string;
  name: keyof PasswordFormData;
  value: string;
  placeholder: string;
  visible: boolean;
  disabled: boolean;
  autoComplete: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onToggleVisibility: () => void;
}

const PasswordInput = ({
  label,
  name,
  value,
  placeholder,
  visible,
  disabled,
  autoComplete,
  onChange,
  onToggleVisibility,
}: PasswordInputProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-[9px] font-black uppercase tracking-wider text-slate-500"
      >
        {label}
      </label>

      <div className="relative mt-1.5">
        <LockKeyhole
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
        />

        <input
          id={name}
          name={name}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          placeholder={placeholder}
          minLength={8}
          maxLength={72}
          required
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={onChange}
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:border-[#0066FF] focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        />

        <button
          type="button"
          onClick={
            onToggleVisibility
          }
          disabled={disabled}
          aria-label={
            visible
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
          className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
};

interface PasswordStrengthPanelProps {
  strength: PasswordStrength;
}

const PasswordStrengthPanel = ({
  strength,
}: PasswordStrengthPanelProps) => {
  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
          Seguridad de la contraseña
        </p>

        <p
          className={`text-xs font-black ${strength.textClass}`}
        >
          {strength.label}
        </p>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map(
          (level) => (
            <div
              key={level}
              className={`h-1.5 rounded-full ${
                level <=
                strength.level
                  ? strength.barClass
                  : "bg-slate-200"
              }`}
            />
          )
        )}
      </div>
    </div>
  );
};

interface SecurityRequirementProps {
  valid: boolean;
  label: string;
}

const SecurityRequirement = ({
  valid,
  label,
}: SecurityRequirementProps) => {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2
        size={14}
        className={
          valid
            ? "text-[#6f9900]"
            : "text-slate-300"
        }
      />

      <span
        className={
          valid
            ? "font-bold text-slate-700"
            : ""
        }
      >
        {label}
      </span>
    </div>
  );
};

interface PasswordStrength {
  level: number;
  label: string;
  barClass: string;
  textClass: string;
}

const calculatePasswordStrength = (
  password: string
): PasswordStrength => {
  if (!password) {
    return {
      level: 0,
      label: "",
      barClass:
        "bg-slate-200",
      textClass:
        "text-slate-400",
    };
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password)
  ) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (
    /[^A-Za-z0-9]/.test(
      password
    ) &&
    password.length >= 12
  ) {
    score += 1;
  }

  if (score <= 1) {
    return {
      level: 1,
      label: "Débil",
      barClass:
        "bg-red-400",
      textClass:
        "text-red-500",
    };
  }

  if (score === 2) {
    return {
      level: 2,
      label: "Aceptable",
      barClass:
        "bg-amber-400",
      textClass:
        "text-amber-600",
    };
  }

  if (score === 3) {
    return {
      level: 3,
      label: "Buena",
      barClass:
        "bg-[#0066FF]",
      textClass:
        "text-[#0066FF]",
    };
  }

  return {
    level: 4,
    label: "Excelente",
    barClass:
      "bg-[#97cf00]",
    textClass:
      "text-[#527200]",
  };
};

const getPasswordErrorMessage = (
  error: unknown
): string => {
  if (
    axios.isAxiosError(error)
  ) {
    const responseData =
      error.response?.data;

    if (
      typeof responseData ===
      "string" &&
      responseData.trim()
    ) {
      return responseData;
    }

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

      const possibleMessage =
        data.message ??
        data.error ??
        data.detail;

      if (
        typeof possibleMessage ===
          "string" &&
        possibleMessage.trim()
      ) {
        return possibleMessage;
      }
    }

    if (
      error.response?.status ===
      401
    ) {
      return "La contraseña actual es incorrecta.";
    }
  }

  return "No fue posible cambiar la contraseña. Revisa los datos e inténtalo nuevamente.";
};

export default ChangePasswordModal;