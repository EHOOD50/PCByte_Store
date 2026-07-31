import React, {
  useEffect,
  useState,
} from "react";

import {
  PackageX,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";

import ReviewOrderStep from "../components/checkout/ReviewOrderStep";
import CheckoutHeader from "../components/checkout/CheckoutHeader";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import GuestInformationStep from "../components/checkout/GuestInformationStep";
import AddressSelector from "../components/checkout/AddressSelector";
import ShippingStep from "../components/checkout/ShippingStep";
import PaymentStep from "../components/checkout/PaymentStep";
import ConfirmationStep from "../components/checkout/ConfirmationStep";

import type {
  CartItem,
} from "../types/types";

import type {
  CheckoutStep,
} from "../components/checkout/CheckoutSteps";

import type {
  GuestInformationData,
} from "../components/checkout/GuestInformationStep";

import type {
  CheckoutAddressData,
} from "../components/checkout/AddressStep";

import type {
  ShippingMethod,
  ShippingQuote,
} from "../components/checkout/ShippingStep";

import type {
  PaymentMethod,
} from "../components/checkout/PaymentStep";

interface CheckoutPageProps {
  cart: CartItem[];

  /*
   * Valor exclusivo de los productos.
   *
   * No incluye despacho.
   */
  subtotal: number;

  onBack: () => void;

  clearCart: () => void;
}

interface StoredCheckoutState {
  currentStep: CheckoutStep;

  informationData: GuestInformationData;

  addressData: CheckoutAddressData;

  shippingMethod: ShippingMethod | null;

  selectedShippingQuote: ShippingQuote | null;

  paymentMethod: PaymentMethod | null;

  /*
   * Representa los productos y cantidades que tenía
   * el carrito cuando se guardó la sesión.
   */
  cartSignature: string;
}

interface InitialCheckoutContext {
  storedCheckout: StoredCheckoutState | null;

  pendingOrderId: number | null;

  paymentReturn:
    | "failure"
    | "pending"
    | null;

  cartChanged: boolean;
}

interface PaymentNotice {
  type:
    | "failure"
    | "pending";

  message: string;
}

interface PaymentPreferenceResponse {
  checkoutUrl?: string;

  orderId?: number;
}

const CHECKOUT_SESSION_KEY =
  "pcbyte_checkout_session_v1";

const PENDING_ORDER_KEY =
  "pcbyte_pending_order_v1";

const initialGuestInformation: GuestInformationData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

const initialAddress: CheckoutAddressData = {
  street: "",
  number: "",
  apartment: "",
  city: "",
  region: "",
  extraInfo: "",
  complementType: "",
  complementDetail: "",
};

const validCheckoutSteps: CheckoutStep[] = [
  "information",
  "address",
  "shipping",
  "payment",
  "review",
  "confirmation",
];

const isCheckoutStep = (
  value: unknown
): value is CheckoutStep => {
  return (
    typeof value ===
      "string" &&
    validCheckoutSteps.includes(
      value as CheckoutStep
    )
  );
};

const isShippingQuote = (
  value: unknown
): value is ShippingQuote => {
  if (
    typeof value !==
      "object" ||
    value === null
  ) {
    return false;
  }

  const quote =
    value as Partial<ShippingQuote>;

  return (
    typeof quote.shippingRateId ===
      "number" &&
    quote.shippingRateId > 0 &&
    typeof quote.shippingType ===
      "string" &&
    typeof quote.label ===
      "string" &&
    typeof quote.carrier ===
      "string" &&
    typeof quote.originalPrice ===
      "number" &&
    typeof quote.cost ===
      "number" &&
    typeof quote.freeShipping ===
      "boolean" &&
    typeof quote.estimatedMinDays ===
      "number" &&
    typeof quote.estimatedMaxDays ===
      "number" &&
    typeof quote.available ===
      "boolean"
  );
};

const createCartSignature = (
  cart: CartItem[]
): string => {
  return cart
    .map((item) => ({
      productId:
        item.product.id,

      quantity:
        item.quantity,
    }))
    .sort(
      (
        firstItem,
        secondItem
      ) =>
        firstItem.productId -
        secondItem.productId
    )
    .map(
      (item) =>
        `${item.productId}:${item.quantity}`
    )
    .join("|");
};

const readStoredCheckout =
  (): StoredCheckoutState | null => {
    try {
      const rawValue =
        sessionStorage.getItem(
          CHECKOUT_SESSION_KEY
        );

      if (!rawValue) {
        return null;
      }

      const parsed =
        JSON.parse(
          rawValue
        ) as Partial<StoredCheckoutState>;

      if (
        !isCheckoutStep(
          parsed.currentStep
        ) ||
        !parsed.informationData ||
        !parsed.addressData
      ) {
        sessionStorage.removeItem(
          CHECKOUT_SESSION_KEY
        );

        return null;
      }

      return {
        currentStep:
          parsed.currentStep,

        informationData:
          parsed.informationData,

        addressData:
          parsed.addressData,

        shippingMethod:
          parsed.shippingMethod ??
          null,

        selectedShippingQuote:
          isShippingQuote(
            parsed.selectedShippingQuote
          )
            ? parsed.selectedShippingQuote
            : null,

        paymentMethod:
          parsed.paymentMethod ??
          null,

        cartSignature:
          typeof parsed.cartSignature ===
          "string"
            ? parsed.cartSignature
            : "",
      };
    } catch {
      sessionStorage.removeItem(
        CHECKOUT_SESSION_KEY
      );

      return null;
    }
  };

const readPendingOrderId =
  (): number | null => {
    const storedValue =
      localStorage.getItem(
        PENDING_ORDER_KEY
      );

    if (!storedValue) {
      return null;
    }

    const parsedValue =
      Number(
        storedValue
      );

    if (
      !Number.isInteger(
        parsedValue
      ) ||
      parsedValue <= 0
    ) {
      localStorage.removeItem(
        PENDING_ORDER_KEY
      );

      return null;
    }

    return parsedValue;
  };

const storePendingOrderId = (
  orderId: number
) => {
  localStorage.setItem(
    PENDING_ORDER_KEY,
    String(
      orderId
    )
  );
};

const clearPendingOrderId =
  () => {
    localStorage.removeItem(
      PENDING_ORDER_KEY
    );
  };

const readPaymentReturn =
  (
    search: string
  ):
    | "failure"
    | "pending"
    | null => {
    const queryParameters =
      new URLSearchParams(
        search
      );

    const paymentReturn =
      queryParameters.get(
        "payment"
      );

    if (
      paymentReturn ===
        "failure" ||
      paymentReturn ===
        "pending"
    ) {
      return paymentReturn;
    }

    return null;
  };

const createInitialCheckoutContext = (
  cart: CartItem[],
  search: string
): InitialCheckoutContext => {
  const paymentReturn =
    readPaymentReturn(
      search
    );

  const pendingOrderId =
    readPendingOrderId();

  /*
   * Una sesión anterior solamente puede recuperarse
   * cuando existe una orden pendiente o se está regresando
   * desde Mercado Pago.
   *
   * Si no existe ninguna de estas condiciones, se considera
   * una compra nueva y se elimina cualquier sesión antigua.
   */
  const canRestoreCheckout =
    pendingOrderId !==
      null ||
    paymentReturn !==
      null;

  if (!canRestoreCheckout) {
    sessionStorage.removeItem(
      CHECKOUT_SESSION_KEY
    );

    return {
      storedCheckout:
        null,

      pendingOrderId:
        null,

      paymentReturn:
        null,

      cartChanged:
        false,
    };
  }

  const storedCheckout =
    readStoredCheckout();

  const currentCartSignature =
    createCartSignature(
      cart
    );

  const cartChanged =
    Boolean(
      storedCheckout &&
      storedCheckout
        .cartSignature !==
        "" &&
      storedCheckout
        .cartSignature !==
        currentCartSignature
    );

  return {
    storedCheckout,
    pendingOrderId,
    paymentReturn,
    cartChanged,
  };
};

const getShippingDescription = (
  quote: ShippingQuote | null
): string => {
  if (!quote) {
    return "";
  }

  const daysText =
    quote.estimatedMinDays ===
    quote.estimatedMaxDays
      ? `${quote.estimatedMinDays} ${
          quote.estimatedMinDays ===
          1
            ? "día hábil"
            : "días hábiles"
        }`
      : `${quote.estimatedMinDays} a ${quote.estimatedMaxDays} días hábiles`;

  return `${quote.carrier} · Entrega estimada en ${daysText}`;
};

export const CheckoutPage = ({
  cart,
  subtotal,
  onBack,
  clearCart,
}: CheckoutPageProps) => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    user,
    isAuthenticated,
  } = useAuth();

  /*
   * Este contexto se calcula una sola vez al montar
   * CheckoutPage.
   */
  const [
    initialCheckoutContext,
  ] = useState<InitialCheckoutContext>(
    () =>
      createInitialCheckoutContext(
        cart,
        location.search
      )
  );

  const storedCheckout =
    initialCheckoutContext
      .storedCheckout;

  const [
    currentStep,
    setCurrentStep,
  ] = useState<CheckoutStep>(
    () => {
      if (
        initialCheckoutContext
          .paymentReturn !==
        null
      ) {
        return "payment";
      }

      if (!storedCheckout) {
        return "information";
      }

      /*
       * Si se agregaron o modificaron productos en una
       * orden pendiente, Datos y Dirección se conservan,
       * pero el despacho debe calcularse nuevamente.
       */
      if (
        initialCheckoutContext
          .cartChanged
      ) {
        return "shipping";
      }

      return storedCheckout
        .currentStep;
    }
  );

  const [
    informationData,
    setInformationData,
  ] =
    useState<GuestInformationData>(
      () =>
        storedCheckout
          ?.informationData ??
        initialGuestInformation
    );

  const [
    addressData,
    setAddressData,
  ] =
    useState<CheckoutAddressData>(
      () =>
        storedCheckout
          ?.addressData ??
        initialAddress
    );

  const [
    shippingMethod,
    setShippingMethod,
  ] =
    useState<ShippingMethod | null>(
      () => {
        if (
          initialCheckoutContext
            .cartChanged
        ) {
          return null;
        }

        return (
          storedCheckout
            ?.shippingMethod ??
          null
        );
      }
    );

  const [
    selectedShippingQuote,
    setSelectedShippingQuote,
  ] =
    useState<ShippingQuote | null>(
      () => {
        if (
          initialCheckoutContext
            .cartChanged
        ) {
          return null;
        }

        return (
          storedCheckout
            ?.selectedShippingQuote ??
          null
        );
      }
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod | null>(
      () => {
        if (
          initialCheckoutContext
            .cartChanged
        ) {
          return null;
        }

        return (
          storedCheckout
            ?.paymentMethod ??
          null
        );
      }
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    paymentError,
    setPaymentError,
  ] = useState("");

  const [
    paymentNotice,
    setPaymentNotice,
  ] =
    useState<PaymentNotice | null>(
      null
    );

  const [
    orderNumber,
    setOrderNumber,
  ] = useState<string | null>(
    () =>
      initialCheckoutContext
        .pendingOrderId !==
      null
        ? String(
            initialCheckoutContext
              .pendingOrderId
          )
        : null
  );

  const shippingCost =
    selectedShippingQuote
      ?.available
      ? selectedShippingQuote.cost
      : 0;

  const checkoutTotal =
    subtotal +
    shippingCost;

  const shippingLabel =
    selectedShippingQuote
      ?.label ??
    (
      shippingMethod ===
      "home_delivery"
        ? "Despacho a domicilio"
        : "No seleccionado"
    );

  const shippingDescription =
    getShippingDescription(
      selectedShippingQuote
    );

  useEffect(() => {
    if (
      !isAuthenticated ||
      !user
    ) {
      return;
    }

    setInformationData(
      (previous) => ({
        firstName:
          previous.firstName ||
          user.firstName ||
          "",

        lastName:
          previous.lastName ||
          user.lastName ||
          "",

        email:
          previous.email ||
          user.email ||
          "",

        phone:
          previous.phone ||
          user.phone ||
          "",
      })
    );
  }, [
    isAuthenticated,
    user,
  ]);

  useEffect(() => {
    const storedState: StoredCheckoutState =
      {
        currentStep,
        informationData,
        addressData,
        shippingMethod,
        selectedShippingQuote,
        paymentMethod,

        cartSignature:
          createCartSignature(
            cart
          ),
      };

    sessionStorage.setItem(
      CHECKOUT_SESSION_KEY,
      JSON.stringify(
        storedState
      )
    );
  }, [
    currentStep,
    informationData,
    addressData,
    shippingMethod,
    selectedShippingQuote,
    paymentMethod,
    cart,
  ]);

  useEffect(() => {
    const queryParameters =
      new URLSearchParams(
        location.search
      );

    const paymentReturn =
      queryParameters.get(
        "payment"
      );

    const returnedOrderId =
      queryParameters.get(
        "external_reference"
      );

    if (returnedOrderId) {
      const parsedOrderId =
        Number(
          returnedOrderId
        );

      if (
        Number.isInteger(
          parsedOrderId
        ) &&
        parsedOrderId > 0
      ) {
        storePendingOrderId(
          parsedOrderId
        );

        setOrderNumber(
          String(
            parsedOrderId
          )
        );
      }
    }

    if (
      paymentReturn !==
        "failure" &&
      paymentReturn !==
        "pending"
    ) {
      return;
    }

    setCurrentStep(
      "payment"
    );

    setPaymentMethod(
      (previous) =>
        previous ??
        "mercado_pago"
    );

    if (
      paymentReturn ===
      "failure"
    ) {
      setPaymentNotice({
        type: "failure",

        message:
          "El pago no fue completado. Puedes revisar la información e intentarlo nuevamente con la misma orden.",
      });
    }

    if (
      paymentReturn ===
      "pending"
    ) {
      setPaymentNotice({
        type: "pending",

        message:
          "El pago quedó pendiente de confirmación. Mercado Pago informará el resultado cuando termine de procesarlo.",
      });
    }

    navigate(
      "/checkout",
      {
        replace: true,
      }
    );
  }, [
    location.search,
    navigate,
  ]);

  const clearShippingSelection =
    () => {
      setShippingMethod(
        null
      );

      setSelectedShippingQuote(
        null
      );
    };

  const handleInformationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setInformationData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };

  const handleAddressChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAddressData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    if (
      name ===
      "city"
    ) {
      clearShippingSelection();
    }
  };

  const handleRegionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const region =
      event.target.value;

    setAddressData(
      (previous) => ({
        ...previous,
        region,
        city: "",
      })
    );

    clearShippingSelection();
  };

  const handleComplementTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const complementType =
      event.target.value;

    setAddressData(
      (previous) => ({
        ...previous,
        complementType,

        complementDetail:
          complementType ===
          ""
            ? ""
            : previous
                .complementDetail,
      })
    );
  };

  const handleShippingMethodChange = (
    method: ShippingMethod
  ) => {
    setShippingMethod(
      method
    );
  };

  const handleShippingQuoteChange = (
    quote: ShippingQuote | null
  ) => {
    setSelectedShippingQuote(
      quote
    );

    if (
      quote?.available
    ) {
      setShippingMethod(
        "home_delivery"
      );

      return;
    }

    setShippingMethod(
      null
    );
  };

  const goToStep = (
    step: CheckoutStep
  ) => {
    setCurrentStep(
      step
    );

    setPaymentError(
      ""
    );

    if (
      step !== "payment"
    ) {
      setPaymentNotice(
        null
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleAddMoreProducts =
    () => {
      navigate(
        "/productos"
      );
    };

  const handlePayment =
    async () => {
      if (
        paymentMethod !==
        "mercado_pago"
      ) {
        return;
      }

      if (
        !selectedShippingQuote ||
        !selectedShippingQuote.available
      ) {
        setPaymentError(
          "Debes seleccionar una tarifa de despacho válida antes de continuar."
        );

        setCurrentStep(
          "shipping"
        );

        return;
      }

      setIsLoading(
        true
      );

      setPaymentError(
        ""
      );

      setPaymentNotice(
        null
      );

      try {
        const apartment =
          addressData
            .complementType &&
          addressData
            .complementDetail
            ? `${addressData.complementType} ${addressData.complementDetail}`.trim()
            : "";

        const pendingOrderId =
          readPendingOrderId();

        const payer = {
          firstName:
            informationData
              .firstName
              .trim(),

          lastName:
            informationData
              .lastName
              .trim(),

          name:
            `${informationData.firstName} ${informationData.lastName}`.trim(),

          email:
            informationData
              .email
              .trim()
              .toLowerCase(),

          phone:
            informationData
              .phone
              .trim(),

          street:
            addressData
              .street
              .trim(),

          number:
            addressData
              .number
              .trim(),

          apartment:
            apartment ||
            null,

          city:
            addressData
              .city
              .trim(),

          region:
            addressData
              .region
              .trim(),

          extraInfo:
            addressData
              .extraInfo
              .trim() ||
            null,
        };

        const response =
          await api.post<PaymentPreferenceResponse>(
            "/payments/create_preference",
            {
              pendingOrderId,

              userId:
                isAuthenticated
                  ? user?.id ??
                    null
                  : null,

              payer,

              items:
                cart.map(
                  (item) => ({
                    productId:
                      item.product
                        .id,

                    name:
                      item.product
                        .name,

                    quantity:
                      item.quantity,
                  })
                ),

              subtotal,

              shippingRateId:
                selectedShippingQuote
                  .shippingRateId,

              shippingType:
                selectedShippingQuote
                  .shippingType,

              shippingMethod,

              shippingLabel:
                selectedShippingQuote
                  .label,

              shippingCarrier:
                selectedShippingQuote
                  .carrier,

              shippingCost:
                selectedShippingQuote
                  .cost,

              shippingFree:
                selectedShippingQuote
                  .freeShipping,

              estimatedMinDays:
                selectedShippingQuote
                  .estimatedMinDays,

              estimatedMaxDays:
                selectedShippingQuote
                  .estimatedMaxDays,

              total:
                checkoutTotal,
            }
          );

        const checkoutUrl =
          response.data
            ?.checkoutUrl;

        const returnedOrderId =
          response.data
            ?.orderId;

        if (!checkoutUrl) {
          throw new Error(
            "El servidor no devolvió la URL de pago."
          );
        }

        if (
          !returnedOrderId ||
          !Number.isInteger(
            returnedOrderId
          ) ||
          returnedOrderId <= 0
        ) {
          throw new Error(
            "El servidor no devolvió un número de orden válido."
          );
        }

        storePendingOrderId(
          returnedOrderId
        );

        setOrderNumber(
          String(
            returnedOrderId
          )
        );

        const storedState: StoredCheckoutState =
          {
            currentStep:
              "payment",

            informationData,

            addressData,

            shippingMethod,

            selectedShippingQuote,

            paymentMethod,

            cartSignature:
              createCartSignature(
                cart
              ),
          };

        sessionStorage.setItem(
          CHECKOUT_SESSION_KEY,
          JSON.stringify(
            storedState
          )
        );

        window.location.href =
          checkoutUrl;
      } catch (
        requestError: unknown
      ) {
        console.error(
          "Error al crear el pago:",
          requestError
        );

        let errorMessage =
          "No fue posible preparar el pago.";

        if (
          requestError instanceof
          Error
        ) {
          errorMessage =
            requestError.message;
        }

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
            "string"
          ) {
            errorMessage =
              responseData;
          } else if (
            responseData?.message
          ) {
            errorMessage =
              responseData.message;
          }
        }

        setPaymentError(
          errorMessage
        );
      } finally {
        setIsLoading(
          false
        );
      }
    };

  const handleGoToCatalog =
    () => {
      sessionStorage.removeItem(
        CHECKOUT_SESSION_KEY
      );

      clearPendingOrderId();

      clearCart();

      navigate(
        "/productos"
      );
    };

  if (
    cart.length === 0
  ) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-white via-[#f8fbff] to-[#f7fbef] px-5 text-slate-900">
        <section className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <PackageX
              size={27}
            />
          </div>

          <h1 className="mt-5 text-2xl font-black tracking-tight">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Agrega productos antes de continuar con el checkout.
          </p>

          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(
                CHECKOUT_SESSION_KEY
              );

              clearPendingOrderId();

              navigate(
                "/productos"
              );
            }}
            className="mt-6 min-h-[48px] rounded-xl bg-slate-900 px-7 text-xs font-black uppercase text-white transition hover:bg-[#0066FF]"
          >
            Volver al catálogo
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-[#f8fbff] to-[#f7fbef] text-slate-900">
      <div className="mx-auto min-h-screen w-full max-w-[1700px] px-4 py-3 sm:px-6 lg:px-10">
        <div className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.11)]">
          <CheckoutHeader
            onBack={
              onBack
            }
          />

          <CheckoutSteps
            currentStep={
              currentStep
            }
          />

          <div className="grid gap-5 bg-slate-50/70 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:p-7">
            <div className="min-w-0">
              {currentStep ===
                "information" && (
                <GuestInformationStep
                  data={
                    informationData
                  }
                  onChange={
                    handleInformationChange
                  }
                  onContinue={() =>
                    goToStep(
                      "address"
                    )
                  }
                />
              )}

              {currentStep ===
                "address" && (
                <AddressSelector
                  data={
                    addressData
                  }
                  onChange={
                    handleAddressChange
                  }
                  onRegionChange={
                    handleRegionChange
                  }
                  onComplementTypeChange={
                    handleComplementTypeChange
                  }
                  onBack={() =>
                    goToStep(
                      "information"
                    )
                  }
                  onContinue={() =>
                    goToStep(
                      "shipping"
                    )
                  }
                />
              )}

              {currentStep ===
                "shipping" && (
                <ShippingStep
                  selectedMethod={
                    shippingMethod
                  }
                  onSelectMethod={
                    handleShippingMethodChange
                  }
                  region={
                    addressData.region
                  }
                  city={
                    addressData.city
                  }
                  subtotal={
                    subtotal
                  }
                  selectedQuote={
                    selectedShippingQuote
                  }
                  onQuoteChange={
                    handleShippingQuoteChange
                  }
                  onBack={() =>
                    goToStep(
                      "address"
                    )
                  }
                  onContinue={() =>
                    goToStep(
                      "payment"
                    )
                  }
                />
              )}

              {currentStep ===
                "payment" && (
                <>
                  {paymentNotice && (
                    <div
                      className={`mb-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
                        paymentNotice.type ===
                        "failure"
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {
                        paymentNotice.message
                      }
                    </div>
                  )}

                  {paymentError && (
                    <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
                      {
                        paymentError
                      }
                    </div>
                  )}

                  <PaymentStep
                    selectedMethod={
                      paymentMethod
                    }
                    isLoading={
                      false
                    }
                    onSelectMethod={
                      setPaymentMethod
                    }
                    onBack={() =>
                      goToStep(
                        "shipping"
                      )
                    }
                    onPay={() =>
                      goToStep(
                        "review"
                      )
                    }
                  />
                </>
              )}

              {currentStep ===
                "review" && (
                <ReviewOrderStep
                  informationData={
                    informationData
                  }
                  addressData={
                    addressData
                  }
                  shippingLabel={
                    shippingLabel
                  }
                  shippingDescription={
                    shippingDescription
                  }
                  shippingCost={
                    shippingCost
                  }
                  paymentMethod={
                    paymentMethod
                  }
                  cart={
                    cart
                  }
                  total={
                    checkoutTotal
                  }
                  isLoading={
                    isLoading
                  }
                  onBack={() =>
                    goToStep(
                      "payment"
                    )
                  }
                  onAddMoreProducts={
                    handleAddMoreProducts
                  }
                  onConfirm={
                    handlePayment
                  }
                />
              )}

              {currentStep ===
                "confirmation" && (
                <ConfirmationStep
                  orderNumber={
                    orderNumber
                  }
                  email={
                    informationData
                      .email
                  }
                  onGoToCatalog={
                    handleGoToCatalog
                  }
                />
              )}
            </div>

            <CheckoutSummary
              cart={
                cart
              }
              subtotal={
                subtotal
              }
              shippingCost={
                selectedShippingQuote
                  ? shippingCost
                  : null
              }
              total={
                checkoutTotal
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;