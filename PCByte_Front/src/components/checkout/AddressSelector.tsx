import {
  useEffect,
  useState,
} from "react";

import {
  createUserAddress,
  setDefaultUserAddress,
} from "../../api/addressApi";

import { useAuth } from "../../hooks/useAuth";
import { useAddresses } from "../../hooks/useAddresses";

import AddressStep from "./AddressStep";
import SavedAddressesStep from "./SavedAddressesStep";

import {
  emptyAddressForm,
} from "../../types/address";

import type {
  ChangeEvent,
} from "react";

import type {
  CheckoutAddressData,
} from "./AddressStep";

import type {
  AddressFormData,
} from "../../types/address";

import type {
  Address,
} from "../../types/types";

interface AddressSelectorProps {
  data: CheckoutAddressData;
  selectedAddressId: number | null;

onSelectedAddressIdChange: (
  addressId: number | null
) => void;

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
  onContinue: () => void;
}

const complementTypes = [
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

const parseApartment = (
  apartment?: string | null
): {
  complementType: string;
  complementDetail: string;
} => {
  const normalizedApartment =
    apartment?.trim() ?? "";

  if (!normalizedApartment) {
    return {
      complementType: "",
      complementDetail: "",
    };
  }

  const matchedType =
    complementTypes.find(
      (type) =>
        normalizedApartment === type ||
        normalizedApartment.startsWith(
          `${type} `
        )
    );

  if (!matchedType) {
    return {
      complementType: "Otro",
      complementDetail:
        normalizedApartment,
    };
  }

  return {
    complementType: matchedType,
    complementDetail:
      normalizedApartment
        .slice(matchedType.length)
        .trim(),
  };
};

export default function AddressSelector({
  data,
  selectedAddressId,
  onSelectedAddressIdChange,
  onChange,
  onRegionChange,
  onComplementTypeChange,
  onBack,
  onContinue,
}: AddressSelectorProps) {

  const {
    user,
    isAuthenticated,
  } = useAuth();


  
  const {
  addresses,
  loading,
  error,
  reloadAddresses,
} = useAddresses(
  isAuthenticated
);





  const [
    useNewAddress,
    setUseNewAddress,
  ] = useState(false);

  

  const [
    preferredAddressId,
    setPreferredAddressId,
  ] = useState<number | null>(
    null
  );

  const [
  settingDefaultAddressId,
  setSettingDefaultAddressId,
] = useState<number | null>(
  null
);

  const [
    addressFormData,
    setAddressFormData,
  ] = useState<AddressFormData>({
    ...emptyAddressForm,
  });

  const [
    isSavingAddress,
    setIsSavingAddress,
  ] = useState(false);

  const [
    saveAddressError,
    setSaveAddressError,
  ] = useState<string | null>(
    null
  );

  /*
   * Selecciona automáticamente:
   *
   * 1. La dirección recién guardada.
   * 2. La dirección predeterminada.
   * 3. La primera dirección disponible.
   */
  useEffect(() => {
  /*
   * Mientras las direcciones todavía se están cargando,
   * conservamos la selección restaurada desde CheckoutPage.
   */
  if (loading) {
    return;
  }

  /*
   * Si realmente terminó la carga y el usuario
   * no posee direcciones, limpiamos la selección.
   */
  if (addresses.length === 0) {
    onSelectedAddressIdChange(
      null
    );

    return;
  }

  /*
   * Una dirección recién creada tiene prioridad.
   */
  if (preferredAddressId !== null) {
    const preferredAddressExists =
      addresses.some(
        (address) =>
          address.id ===
          preferredAddressId
      );

    if (preferredAddressExists) {
      onSelectedAddressIdChange(
        preferredAddressId
      );

      setPreferredAddressId(
        null
      );

      return;
    }
  }

  /*
   * Si CheckoutPage restauró una dirección
   * y todavía existe, la conservamos.
   */
  const selectedStillExists =
    addresses.some(
      (address) =>
        address.id ===
        selectedAddressId
    );

  if (selectedStillExists) {
    return;
  }

  /*
   * Solo cuando no existe una selección válida
   * utilizamos la predeterminada o la primera.
   */
  const defaultAddress =
    addresses.find(
      (address) =>
        address.defaultAddress
    );

  onSelectedAddressIdChange(
    defaultAddress?.id ??
      addresses[0].id
  );
}, [
  addresses,
  loading,
  preferredAddressId,
  selectedAddressId,
  onSelectedAddressIdChange,
]);



  const emitAddressChange = (
    name: keyof CheckoutAddressData,
    value: string
  ) => {
    onChange({
      target: {
        name,
        value,
      },
    } as ChangeEvent<HTMLInputElement>);
  };

  const copySavedAddressToCheckout = (
    address: Address
  ) => {
    const {
      complementType,
      complementDetail,
    } = parseApartment(
      address.apartment
    );

    emitAddressChange(
      "street",
      address.street ?? ""
    );

    emitAddressChange(
      "number",
      address.number ?? ""
    );

    emitAddressChange(
      "apartment",
      address.apartment ?? ""
    );

    emitAddressChange(
      "region",
      address.region ?? ""
    );

    emitAddressChange(
      "city",
      address.city ?? ""
    );

    emitAddressChange(
      "extraInfo",
      address.extraInfo ?? ""
    );

    emitAddressChange(
      "complementType",
      complementType
    );

    emitAddressChange(
      "complementDetail",
      complementDetail
    );
  };

  const handleContinueWithSavedAddress =
    () => {
      const selectedAddress =
        addresses.find(
          (address) =>
            address.id ===
            selectedAddressId
        );

      if (!selectedAddress) {
        return;
      }

      copySavedAddressToCheckout(
        selectedAddress
      );

      onContinue();
    };

    const handleSetDefaultAddress =
  async (
    addressId: number
  ) => {
    if (
      settingDefaultAddressId !==
      null
    ) {
      return;
    }

    setSettingDefaultAddressId(
      addressId
    );

    try {
      await setDefaultUserAddress(
        addressId
      );

      /*
       * Actualizamos silenciosamente para no reemplazar
       * la cuadrícula por el estado de carga.
       *
       * La dirección elegida para esta compra permanece
       * independiente de la dirección predeterminada.
       */
      await reloadAddresses(
        true
      );
    } catch (requestError) {
      console.error(
        "No fue posible establecer la dirección predeterminada:",
        requestError
      );
    } finally {
      setSettingDefaultAddressId(
        null
      );
    }
  };

  const handleOpenNewAddress = () => {
    setAddressFormData({
      ...emptyAddressForm,
      defaultAddress:
        addresses.length === 0,
    });

    setSaveAddressError(null);
    setUseNewAddress(true);
  };

  const handleCancelNewAddress = () => {
    setSaveAddressError(null);

    setAddressFormData({
      ...emptyAddressForm,
    });

    setUseNewAddress(false);
  };

  const handleFormChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } =
      event.target;

    setAddressFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleFormRegionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const region =
      event.target.value;

    setAddressFormData(
      (previous) => ({
        ...previous,
        region,
        city: "",
      })
    );
  };

  const handleFormComplementTypeChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const complementType =
      event.target.value;

    setAddressFormData(
      (previous) => ({
        ...previous,
        complementType,
        complementDetail:
          complementType === ""
            ? ""
            : previous.complementDetail,
      })
    );
  };

  const handleDefaultChange = (
    checked: boolean
  ) => {
    setAddressFormData(
      (previous) => ({
        ...previous,
        defaultAddress: checked,
      })
    );
  };

  const handleSaveAddress =
    async () => {
      if (!user) {
        setSaveAddressError(
          "No fue posible identificar al usuario."
        );
        return;
      }

      setIsSavingAddress(true);
      setSaveAddressError(null);

      try {
        const apartment =
          addressFormData.complementType &&
          addressFormData.complementDetail
            ? `${addressFormData.complementType} ${addressFormData.complementDetail}`.trim()
            : null;

        const savedAddress =
  await createUserAddress({
    label:
      addressFormData.label.trim(),

    street:
      addressFormData.street.trim(),

    number:
      addressFormData.number.trim(),

    apartment,

    city:
      addressFormData.city.trim(),

    region:
      addressFormData.region.trim(),

    extraInfo:
      addressFormData.extraInfo.trim() ||
      null,

    defaultAddress:
      addresses.length === 0 ||
      addressFormData.defaultAddress,
  });

        setPreferredAddressId(
          savedAddress.id
        );

        await reloadAddresses();

        setAddressFormData({
          ...emptyAddressForm,
        });

        setUseNewAddress(false);
      } catch (requestError: any) {
        console.error(
          "Error al guardar dirección:",
          requestError
        );

        const responseData =
          requestError.response?.data;

        const backendMessage =
          typeof responseData ===
          "string"
            ? responseData
            : responseData?.message;

        setSaveAddressError(
          backendMessage ||
            "No fue posible guardar la dirección."
        );
      } finally {
        setIsSavingAddress(false);
      }
    };

  /*
   * Invitado:
   * utiliza una dirección únicamente
   * para la compra actual.
   */
  if (!isAuthenticated) {
    return (
      <AddressStep
        data={data}
        onChange={onChange}
        onRegionChange={
          onRegionChange
        }
        onComplementTypeChange={
          onComplementTypeChange
        }
        onBack={onBack}
        onContinue={onContinue}
        mode="checkout"
      />
    );
  }

  /*
   * Usuario autenticado agregando
   * una dirección nueva.
   */
  if (useNewAddress) {
    return (
      <AddressStep
        data={data}
        onChange={onChange}
        onRegionChange={
          onRegionChange
        }
        onComplementTypeChange={
          onComplementTypeChange
        }
        onBack={
          handleCancelNewAddress
        }
        mode="editor"
        onSave={
          handleSaveAddress
        }
        isSaving={
          isSavingAddress
        }
        saveError={
          saveAddressError
        }
        formData={
          addressFormData
        }
        onFormChange={
          handleFormChange
        }
        onFormRegionChange={
          handleFormRegionChange
        }
        onFormComplementTypeChange={
          handleFormComplementTypeChange
        }
        onDefaultChange={
          handleDefaultChange
        }
      />
    );
  }

  /*
   * Usuario autenticado:
   * siempre ve primero su listado.
   *
   * Si todavía no tiene direcciones,
   * verá el mensaje correspondiente y
   * podrá pulsar "Agregar nueva dirección".
   */
  return (
    <SavedAddressesStep
      addresses={addresses}
      loading={loading}
      error={error}
      selectedAddressId={
        selectedAddressId
      }
      onSelectAddress={
  onSelectedAddressIdChange
}
      onUseNewAddress={
        handleOpenNewAddress
      }
      onBack={onBack}
      onContinue={
        handleContinueWithSavedAddress
      }
      settingDefaultAddressId={
  settingDefaultAddressId
}

onSetDefaultAddress={
  handleSetDefaultAddress
}
    />
  );
}