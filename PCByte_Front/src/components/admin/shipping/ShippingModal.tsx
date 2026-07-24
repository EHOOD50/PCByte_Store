import {
  MapPin,
  Save,
  Truck,
  X,
} from "lucide-react";

import type {
  ChangeEvent,
  FormEvent,
} from "react";

import type {
  ShippingRate,
} from "../../../types/shipping";

export interface ShippingFormData {
  id: number | null;
  name: string;
  region: string;
  city: string;
  shippingType: string;
  carrier: string;
  price: number;
  freeShippingFrom: number | null;
  estimatedMinDays: number;
  estimatedMaxDays: number;
  active: boolean;
  priority: number;
}

interface ShippingModalProps {
  isOpen: boolean;
  formData: ShippingFormData;
  onClose: () => void;
  onChange: (
    formData: ShippingFormData
  ) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
}

const shippingTypes = [
  {
    value: "HOME_DELIVERY",
    label: "Despacho a domicilio",
  },
  {
    value: "EXPRESS",
    label: "Despacho express",
  },
  {
    value: "STORE_PICKUP",
    label: "Retiro en tienda",
  },
];

const ShippingModal = ({
  isOpen,
  formData,
  onClose,
  onChange,
  onSubmit,
}: ShippingModalProps) => {
  if (!isOpen) {
    return null;
  }

  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    const {
      name,
      value,
      type,
    } = event.target;

    if (
      type === "checkbox" &&
      event.target instanceof HTMLInputElement
    ) {
      onChange({
        ...formData,
        [name]:
          event.target.checked,
      });

      return;
    }

    const numericFields = [
      "price",
      "freeShippingFrom",
      "estimatedMinDays",
      "estimatedMaxDays",
      "priority",
    ];

    if (
      numericFields.includes(name)
    ) {
      const parsedValue =
        value === ""
          ? null
          : Number(value);

      onChange({
        ...formData,
        [name]:
          name ===
          "freeShippingFrom"
            ? parsedValue
            : parsedValue ?? 0,
      });

      return;
    }

    onChange({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-slate-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
              <Truck size={21} />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#0066FF]">
                Logística
              </p>

              <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900">
                {formData.id !== null
                  ? "Editar tarifa"
                  : "Nueva tarifa"}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-5 sm:p-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Nombre de la tarifa"
              required
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={
                  handleInputChange
                }
                placeholder="Ej: Pudahuel Express"
                required
                className={inputClassName}
              />
            </Field>

            <Field
              label="Tipo de despacho"
              required
            >
              <select
                name="shippingType"
                value={
                  formData.shippingType
                }
                onChange={
                  handleInputChange
                }
                required
                className={inputClassName}
              >
                {shippingTypes.map(
                  (type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field label="Región">
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={
                  handleInputChange
                }
                placeholder="Vacío = todo Chile"
                className={inputClassName}
              />
            </Field>

            <Field label="Comuna">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={
                  handleInputChange
                }
                placeholder="Vacío = toda la región"
                className={inputClassName}
              />
            </Field>

            <Field label="Transportista">
              <input
                type="text"
                name="carrier"
                value={formData.carrier}
                onChange={
                  handleInputChange
                }
                placeholder="Ej: PCByte, Chilexpress"
                className={inputClassName}
              />
            </Field>

            <Field
              label="Precio"
              required
            >
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={
                  handleInputChange
                }
                min={0}
                step={1}
                required
                className={inputClassName}
              />
            </Field>

            <Field label="Envío gratis desde">
              <input
                type="number"
                name="freeShippingFrom"
                value={
                  formData.freeShippingFrom ??
                  ""
                }
                onChange={
                  handleInputChange
                }
                min={0}
                step={1}
                placeholder="Opcional"
                className={inputClassName}
              />
            </Field>

            <Field
              label="Prioridad"
              required
            >
              <input
                type="number"
                name="priority"
                value={
                  formData.priority
                }
                onChange={
                  handleInputChange
                }
                min={0}
                step={1}
                required
                className={inputClassName}
              />
            </Field>

            <Field
              label="Días mínimos"
              required
            >
              <input
                type="number"
                name="estimatedMinDays"
                value={
                  formData.estimatedMinDays
                }
                onChange={
                  handleInputChange
                }
                min={0}
                step={1}
                required
                className={inputClassName}
              />
            </Field>

            <Field
              label="Días máximos"
              required
            >
              <input
                type="number"
                name="estimatedMaxDays"
                value={
                  formData.estimatedMaxDays
                }
                onChange={
                  handleInputChange
                }
                min={
                  formData.estimatedMinDays
                }
                step={1}
                required
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={
                  handleInputChange
                }
                className="mt-1 h-4 w-4 accent-[#0066FF]"
              />

              <span>
                <span className="block text-sm font-black text-slate-900">
                  Tarifa activa
                </span>

                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Las tarifas inactivas permanecen guardadas, pero no se consideran al cotizar un despacho.
                </span>
              </span>
            </label>
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#0066FF]/15 bg-[#0066FF]/5 p-4">
            <MapPin
              size={18}
              className="mt-0.5 shrink-0 text-[#0066FF]"
            />

            <p className="text-xs leading-5 text-slate-600">
              Para una tarifa nacional deja Región y Comuna vacías. Para toda una región completa la Región y deja la Comuna vacía.
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] rounded-xl border border-slate-200 bg-white px-6 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#97cf00] px-7 text-xs font-black uppercase text-slate-900 transition hover:bg-[#86b900]"
            >
              <Save size={17} />

              {formData.id !== null
                ? "Guardar cambios"
                : "Crear tarifa"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

const Field = ({
  label,
  required = false,
  children,
}: FieldProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
};

const inputClassName =
  "min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10";

export const emptyShippingForm: ShippingFormData = {
  id: null,
  name: "",
  region: "",
  city: "",
  shippingType: "HOME_DELIVERY",
  carrier: "",
  price: 0,
  freeShippingFrom: null,
  estimatedMinDays: 1,
  estimatedMaxDays: 3,
  active: true,
  priority: 0,
};

export const shippingFormToRate = (
  formData: ShippingFormData
): ShippingRate => {
  return {
    id:
      formData.id ??
      undefined,

    name:
      formData.name.trim(),

    region:
      formData.region.trim() ||
      null,

    city:
      formData.city.trim() ||
      null,

    shippingType:
      formData.shippingType,

    carrier:
      formData.carrier.trim() ||
      null,

    price:
      Number(formData.price),

    freeShippingFrom:
      formData.freeShippingFrom ===
      null
        ? null
        : Number(
            formData.freeShippingFrom
          ),

    estimatedMinDays:
      Number(
        formData.estimatedMinDays
      ),

    estimatedMaxDays:
      Number(
        formData.estimatedMaxDays
      ),

    active:
      formData.active,

    priority:
      Number(formData.priority),
  };
};

export const shippingRateToForm = (
  rate: ShippingRate
): ShippingFormData => {
  return {
    id:
      rate.id ??
      null,

    name:
      rate.name,

    region:
      rate.region ??
      "",

    city:
      rate.city ??
      "",

    shippingType:
      rate.shippingType,

    carrier:
      rate.carrier ??
      "",

    price:
      Number(rate.price),

    freeShippingFrom:
      rate.freeShippingFrom ===
      null
        ? null
        : Number(
            rate.freeShippingFrom
          ),

    estimatedMinDays:
      Number(
        rate.estimatedMinDays
      ),

    estimatedMaxDays:
      Number(
        rate.estimatedMaxDays
      ),

    active:
      rate.active,

    priority:
      Number(rate.priority),
  };
};

export default ShippingModal;