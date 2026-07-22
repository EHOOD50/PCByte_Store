import React from "react";
import {
  ArrowRight,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

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
}

export const GuestInformationStep = ({
  data,
  onChange,
  onContinue,
}: GuestInformationStepProps) => {
  const isValid =
    data.firstName.trim() !== "" &&
    data.lastName.trim() !== "" &&
    data.email.trim() !== "" &&
    data.phone.trim() !== "";

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
          <UserRound size={21} />
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
          icon={<UserRound size={17} />}
          label="Nombre(s)"
          name="firstName"
          value={data.firstName}
          placeholder="Ej.: Esteban"
          autoComplete="given-name"
          onChange={onChange}
          required
        />

        <InputField
          icon={<UserRound size={17} />}
          label="Apellido(s)"
          name="lastName"
          value={data.lastName}
          placeholder="Ej.: Hood"
          autoComplete="family-name"
          onChange={onChange}
          required
        />

        <InputField
          icon={<Mail size={17} />}
          label="Correo electrónico"
          name="email"
          type="email"
          value={data.email}
          placeholder="nombre@correo.cl"
          autoComplete="email"
          onChange={onChange}
          required
        />

        <InputField
          icon={<Phone size={17} />}
          label="Teléfono"
          name="phone"
          type="tel"
          value={data.phone}
          placeholder="+56 9 1234 5678"
          autoComplete="tel"
          onChange={onChange}
          required
        />
      </div>

      <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onContinue}
          disabled={!isValid}
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
  name: keyof GuestInformationData;
  value: string;
  label: string;
  placeholder: string;
  icon?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
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
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          onChange={onChange}
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