import {
  AlertCircle,
  Home,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

import {
  createUserAddress,
  deleteUserAddress,
  setDefaultUserAddress,
  updateUserAddress,
  type AddressRequest,
} from "../../../api/addressApi";

import AddressStep from "../../../components/checkout/AddressStep";

import {
  useAddresses,
} from "../../../hooks/useAddresses";

import {
  useAuth,
} from "../../../hooks/useAuth";

import {
  emptyAddressForm,
  type AddressFormData,
} from "../../../types/address";

import type {
  Address,
} from "../../../types/types";

const COMPLEMENT_TYPES = [
  "Departamento",
  "Torre",
  "Block",
  "Parcela",
  "Sitio",
  "Casa",
  "Oficina",
  "Interior",
];

const AddressesPage = () => {
  const {
    user,
    isLoadingAuth,
  } = useAuth();

  const {
    addresses,
    loading,
    error,
    reloadAddresses,
  } = useAddresses(
    user?.id
  );

  const [
    isEditorOpen,
    setIsEditorOpen,
  ] = useState(false);

  const [
    editingAddressId,
    setEditingAddressId,
  ] = useState<number | null>(
    null
  );

  const [
    formData,
    setFormData,
  ] = useState<AddressFormData>({
    ...emptyAddressForm,
  });

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    processingAddressId,
    setProcessingAddressId,
  ] = useState<number | null>(
    null
  );

  const [
    saveError,
    setSaveError,
  ] = useState<string | null>(
    null
  );

  const [
    actionError,
    setActionError,
  ] = useState<string | null>(
    null
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null
  );

  const isEditing =
    editingAddressId !== null;

  const addressStatistics =
    useMemo(() => {
      return {
        total:
          addresses.length,

        defaultCount:
          addresses.some(
            (address) =>
              address.defaultAddress
          )
            ? 1
            : 0,

        additional:
          addresses.filter(
            (address) =>
              !address.defaultAddress
          ).length,
      };
    }, [
      addresses,
    ]);

  const clearMessages = () => {
    setSaveError(null);
    setActionError(null);
    setSuccessMessage(null);
  };

  const resetEditor = () => {
    setEditingAddressId(null);

    setFormData({
      ...emptyAddressForm,
    });

    setSaveError(null);
  };

  const openCreateEditor = () => {
    clearMessages();

    setEditingAddressId(null);

    setFormData({
      ...emptyAddressForm,

      defaultAddress:
        addresses.length === 0,
    });

    setIsEditorOpen(true);
  };

  const openEditEditor = (
    address: Address
  ) => {
    const complement =
      parseApartment(
        address.apartment
      );

    clearMessages();

    setEditingAddressId(
      address.id
    );

    setFormData({
      label:
        address.label ?? "",

      defaultAddress:
        address.defaultAddress,

      street:
        address.street ?? "",

      number:
        address.number ?? "",

      apartment:
        address.apartment ?? "",

      city:
        address.city ?? "",

      region:
        address.region ?? "",

      extraInfo:
        address.extraInfo ?? "",

      complementType:
        complement.type,

      complementDetail:
        complement.detail,
    });

    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    if (isSaving) {
      return;
    }

    setIsEditorOpen(false);
    resetEditor();
  };

  const handleFormChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
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
  };

  const handleRegionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const region =
      event.target.value;

    setFormData(
      (currentForm) => ({
        ...currentForm,
        region,
        city: "",
      })
    );
  };

  const handleComplementTypeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const complementType =
      event.target.value;

    setFormData(
      (currentForm) => ({
        ...currentForm,
        complementType,
        complementDetail: "",
        apartment: "",
      })
    );
  };

  const handleDefaultChange = (
    checked: boolean
  ) => {
    /*
     * Una dirección predeterminada no puede
     * quedar desmarcada sin seleccionar otra.
     */
    if (
      isEditing &&
      formData.defaultAddress &&
      !checked
    ) {
      return;
    }

    setFormData(
      (currentForm) => ({
        ...currentForm,
        defaultAddress:
          checked,
      })
    );
  };

  const handleSave = async () => {
    if (!user?.id) {
      setSaveError(
        "No fue posible identificar al cliente."
      );

      return;
    }

    if (!formData.label.trim()) {
      setSaveError(
        "El nombre de la dirección es obligatorio."
      );

      return;
    }

    if (
      !formData.street.trim() ||
      !formData.number.trim() ||
      !formData.region.trim() ||
      !formData.city.trim()
    ) {
      setSaveError(
        "Completa todos los campos obligatorios."
      );

      return;
    }

    if (
      formData.complementType &&
      !formData.complementDetail.trim()
    ) {
      setSaveError(
        "Completa el detalle del complemento."
      );

      return;
    }

    const request =
      buildAddressRequest(
        formData
      );

    try {
      setIsSaving(true);
      setSaveError(null);
      setActionError(null);
      setSuccessMessage(null);

      if (
        editingAddressId !== null
      ) {
        await updateUserAddress(
          user.id,
          editingAddressId,
          request
        );

        /*
         * Recarga silenciosa:
         * mantiene las tarjetas visibles.
         */
        await reloadAddresses(true);

        setSuccessMessage(
          "La dirección fue actualizada correctamente."
        );
      } else {
        await createUserAddress(
          user.id,
          request
        );

        await reloadAddresses(true);

        setSuccessMessage(
          "La dirección fue agregada correctamente."
        );
      }

      setIsEditorOpen(false);
      resetEditor();
    } catch (saveAddressError) {
      console.error(
        "No fue posible guardar la dirección:",
        saveAddressError
      );

      setSaveError(
        isEditing
          ? "No fue posible actualizar la dirección."
          : "No fue posible guardar la dirección."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = async (
    address: Address
  ) => {
    if (
      !user?.id ||
      address.defaultAddress
    ) {
      return;
    }

    try {
      setProcessingAddressId(
        address.id
      );

      setActionError(null);
      setSuccessMessage(null);

      await setDefaultUserAddress(
        user.id,
        address.id
      );

      /*
       * No mostramos el panel de carga.
       * La cuadrícula conserva su tamaño y posición.
       */
      await reloadAddresses(true);

      setSuccessMessage(
        `"${address.label}" ahora es tu dirección predeterminada.`
      );
    } catch (defaultAddressError) {
      console.error(
        "No fue posible cambiar la dirección predeterminada:",
        defaultAddressError
      );

      setActionError(
        "No fue posible cambiar la dirección predeterminada."
      );
    } finally {
      setProcessingAddressId(
        null
      );
    }
  };

  const handleDelete = async (
    address: Address
  ) => {
    if (!user?.id) {
      return;
    }

    const confirmed =
      window.confirm(
        address.defaultAddress
          ? `¿Deseas eliminar la dirección predeterminada "${address.label}"? Si existen otras direcciones, una de ellas quedará como predeterminada automáticamente.`
          : `¿Deseas eliminar la dirección "${address.label}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setProcessingAddressId(
        address.id
      );

      setActionError(null);
      setSuccessMessage(null);

      await deleteUserAddress(
        user.id,
        address.id
      );

      await reloadAddresses(true);

      setSuccessMessage(
        "La dirección fue eliminada correctamente."
      );
    } catch (deleteAddressError) {
      console.error(
        "No fue posible eliminar la dirección:",
        deleteAddressError
      );

      setActionError(
        "No fue posible eliminar la dirección."
      );
    } finally {
      setProcessingAddressId(
        null
      );
    }
  };

  if (isLoadingAuth) {
    return (
      <LoadingPanel
        title="Cargando tu cuenta"
        description="Estamos recuperando la información de tu sesión."
      />
    );
  }

  if (!user) {
    return (
      <section className="rounded-[2rem] border border-amber-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <AlertCircle
            size={27}
          />
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-900">
          Sesión no disponible
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
          Debes iniciar sesión para consultar y administrar tus direcciones.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Datos de despacho
          </p>

          <div className="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Mis direcciones
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Administra las direcciones que utilizas para recibir tus compras realizadas en PCByte.
              </p>
            </div>

            {!loading &&
              !error &&
              addresses.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  <StatisticCard
                    label="Direcciones"
                    value={
                      addressStatistics.total
                    }
                  />

                  <StatisticCard
                    label="Predeterminada"
                    value={
                      addressStatistics.defaultCount
                    }
                  />

                  <StatisticCard
                    label="Adicionales"
                    value={
                      addressStatistics.additional
                    }
                  />
                </div>
              )}
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={openCreateEditor}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
            >
              <Plus size={17} />
              Agregar dirección
            </button>
          </div>
        </section>

        {successMessage && (
          <section className="flex items-start gap-3 rounded-2xl border border-[#97cf00]/40 bg-[#97cf00]/10 px-5 py-4">
            <Star
              size={19}
              className="mt-0.5 shrink-0 text-[#6f9900]"
            />

            <p className="text-sm font-bold text-[#527200]">
              {successMessage}
            </p>
          </section>
        )}

        {actionError && (
          <section className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <AlertCircle
              size={19}
              className="mt-0.5 shrink-0 text-red-500"
            />

            <p className="text-sm font-bold text-red-600">
              {actionError}
            </p>
          </section>
        )}

        {loading && (
          <LoadingPanel
            title="Cargando tus direcciones"
            description="Estamos consultando tus datos de despacho guardados."
          />
        )}

        {!loading &&
          error && (
            <section className="rounded-[2rem] border border-red-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                <AlertCircle
                  size={27}
                />
              </div>

              <h2 className="mt-5 text-xl font-black text-slate-900">
                No pudimos cargar tus direcciones
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  void reloadAddresses();
                }}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
              >
                <RefreshCw
                  size={16}
                />

                Intentar nuevamente
              </button>
            </section>
          )}

        {!loading &&
          !error &&
          addresses.length === 0 && (
            <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
                <MapPin
                  size={30}
                />
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900">
                Todavía no tienes direcciones
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Agrega una dirección para utilizarla en tus próximas compras y procesos de despacho.
              </p>

              <button
                type="button"
                onClick={openCreateEditor}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
              >
                <Plus
                  size={16}
                />

                Agregar primera dirección
              </button>
            </section>
          )}

        {!loading &&
          !error &&
          addresses.length > 0 && (
            <section className="grid gap-5 xl:grid-cols-2">
              {addresses.map(
                (address) => (
                  <AddressCard
                    key={
                      address.id
                    }
                    address={
                      address
                    }
                    isProcessing={
                      processingAddressId ===
                      address.id
                    }
                    onEdit={() =>
                      openEditEditor(
                        address
                      )
                    }
                    onSetDefault={() => {
                      void handleSetDefault(
                        address
                      );
                    }}
                    onDelete={() => {
                      void handleDelete(
                        address
                      );
                    }}
                  />
                )
              )}
            </section>
          )}
      </div>

      {isEditorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="address-editor-title"
          className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-sm"
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center py-4">
            <div className="relative w-full">
              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
                aria-label="Cerrar formulario"
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>

              <div id="address-editor-title">
                <AddressStep
                  mode="editor"
                  editorEyebrow={
                    isEditing
                      ? "Editar dirección"
                      : "Nueva dirección"
                  }
                  editorTitle={
                    isEditing
                      ? "Editar dirección"
                      : "Agregar dirección"
                  }
                  editorDescription={
                    isEditing
                      ? "Actualiza la información de esta dirección guardada."
                      : "Completa la información para guardar esta dirección en tu Cuenta PCByte."
                  }
                  saveButtonLabel={
                    isEditing
                      ? "Guardar cambios"
                      : "Guardar dirección"
                  }
                  data={
                    formData
                  }
                  formData={
                    formData
                  }
                  onChange={
                    handleFormChange
                  }
                  onRegionChange={
                    handleRegionChange
                  }
                  onComplementTypeChange={
                    handleComplementTypeChange
                  }
                  onFormChange={
                    handleFormChange
                  }
                  onFormRegionChange={
                    handleRegionChange
                  }
                  onFormComplementTypeChange={
                    handleComplementTypeChange
                  }
                  onDefaultChange={
                    handleDefaultChange
                  }
                  onBack={
                    closeEditor
                  }
                  onSave={
                    handleSave
                  }
                  isSaving={
                    isSaving
                  }
                  saveError={
                    saveError
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface AddressCardProps {
  address: Address;
  isProcessing: boolean;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
}

const AddressCard = ({
  address,
  isProcessing,
  onEdit,
  onSetDefault,
  onDelete,
}: AddressCardProps) => {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0066FF]/25">
      {address.defaultAddress && (
        <div className="absolute inset-y-0 left-0 w-1.5 bg-[#97cf00]" />
      )}

      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            address.defaultAddress
              ? "bg-[#97cf00]/15 text-[#6f9900]"
              : "bg-[#0066FF]/10 text-[#0066FF]"
          }`}
        >
          <Home
            size={20}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[1.05rem] font-black text-slate-900">
              {address.label ||
                "Dirección"}
            </h2>

            {address.defaultAddress && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#97cf00]/40 bg-[#97cf00]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#527200]">
                <Star
                  size={11}
                  fill="currentColor"
                />

                Predeterminada
              </span>
            )}
          </div>

          <div className="mt-3 space-y-0.5 text-sm leading-6 text-slate-600">
            <p className="font-bold text-slate-800">
              {address.street}
              {address.number
                ? ` ${address.number}`
                : ""}
            </p>

            {address.apartment && (
              <p>
                {address.apartment}
              </p>
            )}

            <p>
              {[
                address.city,
                address.region,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>

            {address.extraInfo && (
              <p className="pt-1 text-xs leading-5 text-slate-500">
                Referencia:{" "}
                {address.extraInfo}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onEdit}
          disabled={
            isProcessing
          }
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-[11px] font-black uppercase text-slate-600 transition hover:border-[#0066FF]/40 hover:bg-[#0066FF]/5 hover:text-[#0066FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil size={14} />
          Editar
        </button>

        {!address.defaultAddress && (
          <button
            type="button"
            onClick={
              onSetDefault
            }
            disabled={
              isProcessing
            }
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-[#97cf00]/40 bg-[#97cf00]/5 px-3.5 text-[11px] font-black uppercase text-[#527200] transition hover:bg-[#97cf00]/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Star size={14} />
            )}

            Usar como predeterminada
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          disabled={
            isProcessing
          }
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 text-[11px] font-black uppercase text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2
              size={14}
              className="animate-spin"
            />
          ) : (
            <Trash2
              size={14}
            />
          )}

          Eliminar
        </button>
      </div>
    </article>
  );
};

interface LoadingPanelProps {
  title: string;
  description: string;
}

const LoadingPanel = ({
  title,
  description,
}: LoadingPanelProps) => {
  return (
    <section className="flex min-h-72 items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <Loader2
          size={34}
          className="mx-auto animate-spin text-[#0066FF]"
        />

        <p className="mt-4 text-sm font-black text-slate-800">
          {title}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </section>
  );
};

interface StatisticCardProps {
  label: string;
  value: number;
}

const StatisticCard = ({
  label,
  value,
}: StatisticCardProps) => {
  return (
    <div className="min-w-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
      <p className="text-xl font-black text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
    </div>
  );
};

function buildAddressRequest(
  data: AddressFormData
): AddressRequest {
  return {
    label:
      data.label.trim(),

    street:
      data.street.trim(),

    number:
      data.number.trim(),

    apartment:
      buildApartment(data),

    city:
      data.city.trim(),

    region:
      data.region.trim(),

    extraInfo:
      data.extraInfo.trim() ||
      null,

    defaultAddress:
      data.defaultAddress,
  };
}

function buildApartment(
  data: AddressFormData
): string | null {
  const type =
    data.complementType.trim();

  const detail =
    data.complementDetail.trim();

  if (
    !type ||
    !detail
  ) {
    return null;
  }

  if (type === "Otro") {
    return detail;
  }

  return `${type} ${detail}`;
}

function parseApartment(
  apartment?: string | null
): {
  type: string;
  detail: string;
} {
  const normalized =
    apartment?.trim() ??
    "";

  if (!normalized) {
    return {
      type: "",
      detail: "",
    };
  }

  const knownType =
    COMPLEMENT_TYPES.find(
      (type) =>
        normalized === type ||
        normalized.startsWith(
          `${type} `
        )
    );

  if (!knownType) {
    return {
      type: "Otro",
      detail: normalized,
    };
  }

  return {
    type:
      knownType,

    detail:
      normalized
        .slice(
          knownType.length
        )
        .trim(),
  };
}

export default AddressesPage;