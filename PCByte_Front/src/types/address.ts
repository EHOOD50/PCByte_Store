export interface AddressFormData {
  label: string;

  defaultAddress: boolean;

  street: string;

  number: string;

  apartment: string;

  city: string;

  region: string;

  extraInfo: string;

  complementType: string;

  complementDetail: string;
}

export const emptyAddressForm: AddressFormData =
  {
    label: "",

    defaultAddress: false,

    street: "",

    number: "",

    apartment: "",

    city: "",

    region: "",

    extraInfo: "",

    complementType: "",

    complementDetail: "",
  };