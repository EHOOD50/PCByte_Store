import { useMemo } from "react";

import {
  Building2,
  MapPin,
  Star,
  Tag,
} from "lucide-react";

import { REGIONES_CHILE } from "../../data/regionesChile";

import type {
  ChangeEvent,
  ReactNode,
} from "react";

import type {
  AddressFormData,
} from "../../types/address";

interface AddressFormProps {
  data: AddressFormData;

  onChange: (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => void;

  onRegionChange: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;

  onComplementTypeChange: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;

  onDefaultChange: (
    checked: boolean
  ) => void;

  readOnly?: boolean;
}

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

export default function AddressForm({
  data,
  onChange,
  onRegionChange,
  onComplementTypeChange,
  onDefaultChange,
  readOnly = false,
}: AddressFormProps) {
  const availableCommunes =
    useMemo(() => {
      const selectedRegion =
        REGIONES_CHILE.find(
          (region) =>
            region.nombre ===
            data.region
        );

      return (
        selectedRegion?.comunas ?? []
      );
    }, [data.region]);

  const complementPlaceholder =
    useMemo(() => {
      if (!data.complementType) {
        return "Selecciona primero un tipo";
      }

      return (
        complementPlaceholders[
          data.complementType
        ] ?? "Escribe el detalle"
      );
    }, [data.complementType]);

  return (
    <div>
      {/* IDENTIFICACIÓN */}
      <div className="rounded-2xl border border-[#97cf00]/25 bg-[#97cf00]/5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#97cf00]/15 text-[#6f9900]">
            <Tag size={17} />
          </div>

          <div>
            <p className="text-sm font-black text-slate-800">
              Identifica esta dirección
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Utiliza un nombre que te permita reconocerla fácilmente.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <InputField
            label="Nombre de la dirección"
            name="label"
            value={data.label}
            placeholder="Ej.: Casa, Trabajo u Oficina"
            icon={<Tag size={17} />}
            onChange={onChange}
            disabled={readOnly}
            required
          />
        </div>
      </div>

      {/* CALLE Y NÚMERO */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_0.5fr]">
        <InputField
          label="Calle o avenida"
          name="street"
          value={data.street}
          placeholder="Ej.: Avenida Alameda"
          icon={<MapPin size={17} />}
          autoComplete="address-line1"
          onChange={onChange}
          disabled={readOnly}
          required
        />

        <InputField
          label="Número"
          name="number"
          value={data.number}
          placeholder="Ej.: 1234"
          onChange={onChange}
          disabled={readOnly}
          required
        />
      </div>

      {/* COMPLEMENTO */}
      <div className="mt-4 rounded-2xl border border-[#0066FF]/15 bg-[#f8fbff] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
            <Building2 size={18} />
          </div>

          <div>
            <p className="text-sm font-black text-slate-800">
              Ubicación dentro del recinto
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Completa estos campos solamente cuando corresponda.
            </p>
          </div>

          <span className="ml-auto text-[9px] font-black uppercase tracking-wider text-slate-400">
            Opcional
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <SelectField
            label="Tipo de complemento"
            name="complementType"
            value={data.complementType}
            onChange={
              onComplementTypeChange
            }
            disabled={readOnly}
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
            value={data.complementDetail}
            placeholder={
              complementPlaceholder
            }
            onChange={onChange}
            disabled={
              readOnly ||
              !data.complementType
            }
            required={Boolean(
              data.complementType
            )}
          />
        </div>
      </div>

      {/* REGIÓN Y COMUNA */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          label="Región"
          name="region"
          value={data.region}
          onChange={onRegionChange}
          disabled={readOnly}
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
          value={data.city}
          onChange={onChange}
          disabled={
            readOnly ||
            !data.region
          }
          required
        >
          <option value="">
            {data.region
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

      {/* REFERENCIA */}
      <div className="mt-4">
        <InputField
          label="Referencia para el despacho"
          name="extraInfo"
          value={data.extraInfo}
          placeholder="Ej.: Alameda entre Maipú y Chacabuco"
          icon={<MapPin size={17} />}
          onChange={onChange}
          disabled={readOnly}
          optional
        />
      </div>

      {/* PREDETERMINADA */}
      <label
        className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 transition ${
          data.defaultAddress
            ? "border-[#97cf00]/50 bg-[#97cf00]/10"
            : "border-slate-200 bg-slate-50"
        } ${
          readOnly
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer hover:border-[#97cf00]/40"
        }`}
      >
        <input
          type="checkbox"
          checked={
            data.defaultAddress
          }
          disabled={readOnly}
          onChange={(event) =>
            onDefaultChange(
              event.target.checked
            )
          }
          className="mt-1 h-4 w-4 accent-[#97cf00]"
        />

        <Star
          size={18}
          className={
            data.defaultAddress
              ? "mt-0.5 shrink-0 text-[#6f9900]"
              : "mt-0.5 shrink-0 text-slate-400"
          }
        />

        <div>
          <p className="text-sm font-black text-slate-800">
            Dirección predeterminada
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Esta dirección aparecerá seleccionada inicialmente en tus próximas compras.
          </p>
        </div>
      </label>
    </div>
  );
}

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
  name: keyof AddressFormData;
  value: string;
  label: string;
  placeholder: string;
  icon?: ReactNode;
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;

  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}

const InputField = ({
  name,
  value,
  label,
  placeholder,
  icon,
  autoComplete,
  required = false,
  optional = false,
  disabled = false,
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
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          onChange={onChange}
          className={`h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pr-4 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:border-[#0066FF] focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
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
  name: keyof AddressFormData;
  value: string;
  label: string;
  children: ReactNode;
  required?: boolean;
  disabled?: boolean;

  onChange: (
    event: ChangeEvent<HTMLSelectElement>
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
        className="mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-900 outline-none transition focus:border-[#0066FF] focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        {children}
      </select>
    </div>
  );
};