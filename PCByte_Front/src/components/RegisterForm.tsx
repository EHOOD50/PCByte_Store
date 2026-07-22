import React, {
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";

import logo from "../assets/logo.png";
import { REGIONES_CHILE } from "../data/regionesChile";
import { useAuth } from "../hooks/useAuth";

import type {
  AuthUser,
  RegisterRequest,
} from "../types/auth";

interface RegisterFormProps {
  onRegisterSuccess: (
    user: AuthUser
  ) => void;
  onBack: () => void;
  onLogin: () => void;
}

interface RegisterFormState
  extends RegisterRequest {
  confirmPassword: string;
}

const initialFormData: RegisterFormState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",

  addressLabel: "Principal",
  street: "",
  number: "",
  apartment: "",
  city: "",
  region: "",
  extraInfo: "",

  complementType: "",
  complementDetail: "",
};

const complementOptions = [
  "Departamento",
  "Torre",
  "Block",
  "Parcela",
  "Sitio",
  "Casa",
  "Oficina",
  "Interior",
  "Otro",
];

const complementPlaceholders: Record<
  string,
  string
> = {
  Departamento: "Ej.: 1203",
  Torre: "Ej.: B",
  Block: "Ej.: 4",
  Parcela: "Ej.: 7",
  Sitio: "Ej.: 12",
  Casa: "Ej.: 18",
  Oficina: "Ej.: 305",
  Interior: "Ej.: B",
  Otro: "Escribe el detalle",
};

export const RegisterForm = ({
  onRegisterSuccess,
  onBack,
  onLogin,
}: RegisterFormProps) => {
  const { register } = useAuth();

  const [formData, setFormData] =
    useState<RegisterFormState>(
      initialFormData
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const passwordsMatch =
    formData.confirmPassword.length >
      0 &&
    formData.password ===
      formData.confirmPassword;

  const passwordsDoNotMatch =
    formData.confirmPassword.length >
      0 &&
    formData.password !==
      formData.confirmPassword;

  const availableCommunes =
    useMemo(() => {
      const selectedRegion =
        REGIONES_CHILE.find(
          (region) =>
            region.nombre ===
            formData.region
        );

      return (
        selectedRegion?.comunas ?? []
      );
    }, [formData.region]);

  const complementPlaceholder =
    useMemo(() => {
      if (!formData.complementType) {
        return "Selecciona primero un tipo";
      }

      return (
        complementPlaceholders[
          formData.complementType
        ] ?? "Escribe el detalle"
      );
    }, [formData.complementType]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleRegionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const region =
      event.target.value;

    setFormData((previous) => ({
      ...previous,
      region,
      city: "",
    }));
  };

  const handleComplementTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const complementType =
      event.target.value;

    setFormData((previous) => ({
      ...previous,
      complementType,
      complementDetail:
        complementType === ""
          ? ""
          : previous.complementDetail,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Las contraseñas no coinciden."
      );
      return;
    }

    if (
      formData.password.length < 8 ||
      formData.password.length > 72
    ) {
      setError(
        "La contraseña debe contener entre 8 y 72 caracteres."
      );
      return;
    }

    if (
      formData.complementType &&
      !formData.complementDetail?.trim()
    ) {
      setError(
        "Ingresa el detalle del complemento de dirección."
      );
      return;
    }

    setLoading(true);

    try {
      const apartment =
        formData.complementType &&
        formData.complementDetail
          ? `${formData.complementType} ${formData.complementDetail}`.trim()
          : "";

      const request: RegisterRequest = {
        firstName:
          formData.firstName.trim(),

        lastName:
          formData.lastName.trim(),

        email: formData.email
          .trim()
          .toLowerCase(),

        password:
          formData.password,

        phone:
          formData.phone?.trim() ||
          undefined,

        addressLabel: "Principal",

        street:
          formData.street?.trim() ||
          undefined,

        number:
          formData.number?.trim() ||
          undefined,

        apartment:
          apartment || undefined,

        city:
          formData.city?.trim() ||
          undefined,

        region:
          formData.region?.trim() ||
          undefined,

        extraInfo:
          formData.extraInfo?.trim() ||
          undefined,
      };

      const registeredUser =
        await register(request);

      onRegisterSuccess(
        registeredUser
      );
    } catch (requestError: any) {
      console.error(
        "Error al registrar usuario:",
        requestError
      );

      const responseData =
        requestError.response?.data;

      const backendMessage =
        typeof responseData ===
        "string"
          ? responseData
          : responseData?.message;

      setError(
        backendMessage ||
          "No fue posible crear la cuenta. Revisa los datos ingresados."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.11)]">
      {/* CABECERA INTEGRADA */}
      <header className="border-b border-slate-100 bg-gradient-to-r from-[#f7fbef] via-white to-[#f3f7ff] px-6 py-4 sm:px-8">
        <div className="grid items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
          <img
            src={logo}
            alt="PCByte"
            className="mx-auto h-auto w-48 object-contain sm:w-56 lg:mx-0"
          />

          <div className="text-center lg:border-l lg:border-slate-200 lg:pl-7 lg:text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
              Cuenta PCByte
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Crea tu Cuenta PCByte
            </h1>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm">
              Registra tus datos y una dirección predeterminada para mantener organizada tu experiencia con PCByte.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              <ChevronLeft size={15} />
              Volver al catálogo
            </button>

            <button
              type="button"
              onClick={onLogin}
              className="flex items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#0055d4]"
            >
              <LogIn size={15} />
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6 lg:p-7"
      >
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr] xl:gap-8">
          {/* DATOS DE CUENTA */}
          <section>
            <SectionTitle
              icon={
                <User size={17} />
              }
              title="Datos de la cuenta"
              description="Información personal y credenciales de acceso."
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputField
                icon={
                  <User size={16} />
                }
                label="Nombre(s)"
                name="firstName"
                value={
                  formData.firstName
                }
                placeholder="Ej.: Esteban"
                autoComplete="given-name"
                onChange={handleChange}
                required
              />

              <InputField
                icon={
                  <User size={16} />
                }
                label="Apellido(s)"
                name="lastName"
                value={
                  formData.lastName
                }
                placeholder="Ej.: Hood"
                autoComplete="family-name"
                onChange={handleChange}
                required
              />

              <InputField
                icon={
                  <Mail size={16} />
                }
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                placeholder="nombre@correo.cl"
                autoComplete="email"
                onChange={handleChange}
                required
              />

              <InputField
                icon={
                  <Phone size={16} />
                }
                label="Teléfono"
                optional
                name="phone"
                type="tel"
                value={
                  formData.phone ?? ""
                }
                placeholder="+56 9 1234 5678"
                autoComplete="tel"
                onChange={handleChange}
              />

              <PasswordField
                label="Contraseña"
                name="password"
                value={
                  formData.password
                }
                visible={showPassword}
                onToggleVisibility={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
                onChange={handleChange}
                autoComplete="new-password"
              />

              <PasswordField
                label="Confirmar contraseña"
                name="confirmPassword"
                value={
                  formData.confirmPassword
                }
                visible={
                  showConfirmPassword
                }
                onToggleVisibility={() =>
                  setShowConfirmPassword(
                    (previous) =>
                      !previous
                  )
                }
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="mt-2 min-h-4">
              {passwordsMatch && (
                <p className="flex items-center gap-2 text-[11px] font-bold text-[#6f9900]">
                  <CheckCircle2
                    size={14}
                  />
                  Las contraseñas coinciden.
                </p>
              )}

              {passwordsDoNotMatch && (
                <p className="text-[11px] font-bold text-amber-600">
                  Las contraseñas aún no coinciden.
                </p>
              )}
            </div>
          </section>

          {/* DIRECCIÓN */}
          <section className="border-t border-slate-200 pt-5 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0">
            <SectionTitle
              icon={
                <MapPin size={17} />
              }
              title="Dirección predeterminada"
              description="Será utilizada inicialmente en tus compras y podrás modificarla desde tu cuenta."
            />

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_0.5fr]">
              <InputField
                icon={
                  <MapPin size={16} />
                }
                label="Calle o avenida"
                name="street"
                value={
                  formData.street ?? ""
                }
                placeholder="Ej.: Avenida Alameda"
                autoComplete="address-line1"
                onChange={handleChange}
                required
              />

              <InputField
                label="Número"
                name="number"
                value={
                  formData.number ?? ""
                }
                placeholder="Ej.: 1234"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mt-3 rounded-2xl border border-[#0066FF]/15 bg-[#f8fbff] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
                  <Building2
                    size={16}
                  />
                </div>

                <div>
                  <p className="text-xs font-black text-slate-800">
                    Ubicación dentro del recinto
                  </p>

                  <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                    Indica el tipo y su detalle cuando corresponda.
                  </p>
                </div>

                <span className="ml-auto text-[8px] font-black uppercase tracking-wider text-slate-400">
                  Opcional
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <SelectField
                  label="Tipo de complemento"
                  name="complementType"
                  value={
                    formData.complementType ??
                    ""
                  }
                  onChange={
                    handleComplementTypeChange
                  }
                >
                  <option value="">
                    Sin complemento
                  </option>

                  {complementOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    )
                  )}
                </SelectField>

                <InputField
                  label="Detalle"
                  name="complementDetail"
                  value={
                    formData.complementDetail ??
                    ""
                  }
                  placeholder={
                    complementPlaceholder
                  }
                  onChange={handleChange}
                  disabled={
                    !formData.complementType
                  }
                  required={Boolean(
                    formData.complementType
                  )}
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <SelectField
                label="Región"
                name="region"
                value={
                  formData.region ?? ""
                }
                onChange={
                  handleRegionChange
                }
                required
              >
                <option value="">
                  Selecciona una región
                </option>

                {REGIONES_CHILE.map(
                  (region) => (
                    <option
                      key={region.nombre}
                      value={region.nombre}
                    >
                      {region.nombre}
                    </option>
                  )
                )}
              </SelectField>

              <SelectField
                label="Comuna"
                name="city"
                value={
                  formData.city ?? ""
                }
                onChange={handleChange}
                disabled={
                  !formData.region
                }
                required
              >
                <option value="">
                  {formData.region
                    ? "Selecciona una comuna"
                    : "Selecciona primero una región"}
                </option>

                {availableCommunes.map(
                  (commune) => (
                    <option
                      key={commune}
                      value={commune}
                    >
                      {commune}
                    </option>
                  )
                )}
              </SelectField>
            </div>

            <div className="mt-3">
              <InputField
                icon={
                  <MapPin size={16} />
                }
                label="Referencia para el despacho"
                optional
                name="extraInfo"
                value={
                  formData.extraInfo ??
                  ""
                }
                placeholder="Ej.: Alameda entre Maipú y Chacabuco"
                onChange={handleChange}
              />
            </div>
          </section>
        </div>

        <div className="mt-5 grid items-center gap-4 border-t border-slate-200 pt-4 lg:grid-cols-[1fr_auto]">
          <div className="flex items-start gap-3 rounded-2xl border border-[#97cf00]/25 bg-[#97cf00]/5 px-4 py-3">
            <ShieldCheck
              size={18}
              className="mt-0.5 shrink-0 text-[#6f9900]"
            />

            <p className="text-[11px] leading-5 text-slate-600">
              Tu información será utilizada únicamente para gestionar tu cuenta, compras, despachos y garantías.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex min-h-[48px] w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 px-8 text-xs font-black uppercase text-white transition hover:bg-[#97cf00] hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear mi Cuenta PCByte

                <ArrowRight
                  size={18}
                  className="text-[#0066FF] transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

interface SectionTitleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SectionTitle = ({
  icon,
  title,
  description,
}: SectionTitleProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[#0066FF]">
        {icon}
      </div>

      <div>
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
          {title}
        </h2>

        <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
};

interface FieldLabelProps {
  label: string;
  optional?: boolean;
}

const FieldLabel = ({
  label,
  optional = false,
}: FieldLabelProps) => {
  return (
    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-slate-500">
      {label}

      {optional && (
        <span className="text-[8px] font-bold normal-case tracking-normal text-slate-400">
          (opcional)
        </span>
      )}
    </label>
  );
};

interface InputFieldProps {
  name: string;
  value: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;
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
  optional = false,
  disabled = false,
  minLength,
  maxLength,
  onChange,
}: InputFieldProps) => {
  return (
    <div>
      <FieldLabel
        label={label}
        optional={optional}
      />

      <div className="relative mt-1.5">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
            {icon}
          </div>
        )}

        <input
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          minLength={minLength}
          maxLength={maxLength}
          onChange={onChange}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 text-xs font-bold text-slate-800 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:border-[#0066FF] focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
            icon
              ? "pl-11"
              : "pl-4"
          }`}
        />
      </div>
    </div>
  );
};

interface SelectFieldProps {
  name: string;
  value: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
}

const SelectField = ({
  name,
  value,
  label,
  children,
  required = false,
  disabled = false,
  onChange,
}: SelectFieldProps) => {
  return (
    <div>
      <FieldLabel label={label} />

      <select
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-800 outline-none transition focus:border-[#0066FF] focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        {children}
      </select>
    </div>
  );
};

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  visible: boolean;
  autoComplete: string;
  onToggleVisibility: () => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

const PasswordField = ({
  label,
  name,
  value,
  visible,
  autoComplete,
  onToggleVisibility,
  onChange,
}: PasswordFieldProps) => {
  return (
    <div>
      <FieldLabel label={label} />

      <div className="relative mt-1.5">
        <Lock
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
        />

        <input
          name={name}
          type={
            visible
              ? "text"
              : "password"
          }
          value={value}
          placeholder="Mínimo 8 caracteres"
          autoComplete={autoComplete}
          required
          minLength={8}
          maxLength={72}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-11 text-xs font-bold text-slate-800 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:border-[#0066FF] focus:bg-white"
        />

        <button
          type="button"
          onClick={
            onToggleVisibility
          }
          aria-label={
            visible
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0066FF]"
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