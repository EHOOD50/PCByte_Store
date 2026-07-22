import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  MapPin,
  Save,
} from "lucide-react";

import AddressForm from "../address/AddressForm";

import type {
  ChangeEvent,
} from "react";

import type {
  AddressFormData,
} from "../../types/address";

export interface CheckoutAddressData {
  street: string;
  number: string;
  apartment: string;
  city: string;
  region: string;
  extraInfo: string;
  complementType: string;
  complementDetail: string;
}

interface AddressStepProps {
  data: CheckoutAddressData;

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

  onBack: () => void;
  onContinue?: () => void;

  mode?: "checkout" | "editor";
  onSave?: () => void;
  isSaving?: boolean;
  saveError?: string | null;

  formData?: AddressFormData;

  onFormChange?: (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => void;

  onFormRegionChange?: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;

  onFormComplementTypeChange?: (
    event: ChangeEvent<HTMLSelectElement>
  ) => void;

  onDefaultChange?: (
    checked: boolean
  ) => void;
}

export const AddressStep = ({
  data,
  onChange,
  onRegionChange,
  onComplementTypeChange,
  onBack,
  onContinue,
  mode = "checkout",
  onSave,
  isSaving = false,
  saveError = null,
  formData,
  onFormChange,
  onFormRegionChange,
  onFormComplementTypeChange,
  onDefaultChange,
}: AddressStepProps) => {
  const editorMode =
    mode === "editor";

  const [
    localLabel,
    setLocalLabel,
  ] = useState(
    editorMode
      ? "Nueva dirección"
      : "Dirección de despacho"
  );

  const [
    localDefaultAddress,
    setLocalDefaultAddress,
  ] = useState(false);

  useEffect(() => {
    if (!editorMode) {
      return;
    }

    setLocalLabel(
      formData?.label ||
        "Nueva dirección"
    );

    setLocalDefaultAddress(
      formData?.defaultAddress ??
        false
    );
  }, [
    editorMode,
    formData?.label,
    formData?.defaultAddress,
  ]);

  const effectiveFormData =
    useMemo<AddressFormData>(
      () => ({
        label:
          formData?.label ??
          localLabel,

        defaultAddress:
          formData?.defaultAddress ??
          localDefaultAddress,

        street:
          formData?.street ??
          data.street,

        number:
          formData?.number ??
          data.number,

        apartment:
          formData?.apartment ??
          data.apartment,

        city:
          formData?.city ??
          data.city,

        region:
          formData?.region ??
          data.region,

        extraInfo:
          formData?.extraInfo ??
          data.extraInfo,

        complementType:
          formData?.complementType ??
          data.complementType,

        complementDetail:
          formData?.complementDetail ??
          data.complementDetail,
      }),
      [
        formData,
        localLabel,
        localDefaultAddress,
        data,
      ]
    );

  const isValid =
    effectiveFormData.street.trim() !==
      "" &&
    effectiveFormData.number.trim() !==
      "" &&
    effectiveFormData.region.trim() !==
      "" &&
    effectiveFormData.city.trim() !==
      "" &&
    (
      !effectiveFormData.complementType ||
      effectiveFormData.complementDetail.trim() !==
        ""
    ) &&
    (
      !editorMode ||
      effectiveFormData.label.trim() !==
        ""
    );

  const handleFormChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    if (onFormChange) {
      onFormChange(event);
      return;
    }

    const { name, value } =
      event.target;

    if (name === "label") {
      setLocalLabel(value);
      return;
    }

    onChange(event);
  };

  const handleDefaultChange = (
    checked: boolean
  ) => {
    if (onDefaultChange) {
      onDefaultChange(checked);
      return;
    }

    setLocalDefaultAddress(
      checked
    );
  };

  const handlePrimaryAction =
    () => {
      if (
        !isValid ||
        isSaving
      ) {
        return;
      }

      if (editorMode) {
        onSave?.();
        return;
      }

      onContinue?.();
    };

  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#6f9900]">
          <MapPin size={21} />
        </div>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
            {editorMode
              ? "Nueva dirección"
              : "Paso 2"}
          </p>

          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            {editorMode
              ? "Agregar dirección"
              : "Dirección de despacho"}
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            {editorMode
              ? "Completa la información para guardar esta dirección en tu Cuenta PCByte."
              : "Indica dónde deseas recibir tu compra."}
          </p>
        </div>
      </div>

      {saveError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {saveError}
        </div>
      )}

      <div className="mt-5">
        <AddressForm
          data={
            effectiveFormData
          }
          onChange={
            handleFormChange
          }
          onRegionChange={
            onFormRegionChange ??
            onRegionChange
          }
          onComplementTypeChange={
            onFormComplementTypeChange ??
            onComplementTypeChange
          }
          onDefaultChange={
            handleDefaultChange
          }
          readOnly={isSaving}
        />
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="flex min-h-[50px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={17} />

          {editorMode
            ? "Cancelar"
            : "Volver a datos"}
        </button>

        <button
          type="button"
          onClick={
            handlePrimaryAction
          }
          disabled={
            !isValid ||
            isSaving
          }
          className={`group flex min-h-[50px] items-center justify-center gap-3 rounded-xl px-7 text-xs font-black uppercase transition disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 ${
            editorMode
              ? "bg-[#97cf00] text-slate-900 hover:bg-[#86b900]"
              : "bg-slate-900 text-white hover:bg-[#0066FF]"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />

              Guardando dirección...
            </>
          ) : editorMode ? (
            <>
              <Save size={18} />
              Guardar dirección
            </>
          ) : (
            <>
              Continuar a despacho

              <ArrowRight
                size={18}
                className="text-[#97cf00] transition-transform group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default AddressStep;