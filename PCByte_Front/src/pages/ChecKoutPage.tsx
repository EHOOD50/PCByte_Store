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
} from "../components/checkout/ShippingStep";

import type {
  PaymentMethod,
} from "../components/checkout/PaymentStep";

interface CheckoutPageProps {
  cart: CartItem[];
  total: number;
  onBack: () => void;
  clearCart: () => void;
}

interface StoredCheckoutState {
  currentStep: CheckoutStep;
  informationData: GuestInformationData;
  addressData: CheckoutAddressData;
  shippingMethod: ShippingMethod | null;
  paymentMethod: PaymentMethod | null;

  /*
   * Representa los productos y cantidades que tenía
   * el carrito cuando se guardó la sesión.
   *
   * Si cambia, el checkout vuelve al paso de despacho.
   */
  cartSignature: string;
}

interface PaymentNotice {
  type: "failure" | "pending";
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
    typeof value === "string" &&
    validCheckoutSteps.includes(
      value as CheckoutStep
    )
  );
};

/*
 * Genera una firma estable a partir de:
 *
 * - ID del producto
 * - cantidad
 *
 * El orden de los productos no afecta el resultado.
 */
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
      (firstItem, secondItem) =>
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

        paymentMethod:
          parsed.paymentMethod ??
          null,

        /*
         * Compatibilidad con sesiones creadas antes
         * de agregar cartSignature.
         */
        cartSignature:
          typeof parsed.cartSignature ===
          "string"
            ? parsed.cartSignature
            : "",
      };
    } catch {
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
      Number(storedValue);

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
    String(orderId)
  );
};

const clearPendingOrderId =
  () => {
    localStorage.removeItem(
      PENDING_ORDER_KEY
    );
  };

export const CheckoutPage = ({
  cart,
  total,
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
   * Determina el paso inicial.
   *
   * Reglas:
   *
   * 1. Si vuelve desde Mercado Pago con failure o pending,
   *    regresa al paso de pago.
   *
   * 2. Si no existe una sesión previa, comienza en datos.
   *
   * 3. Si el carrito cambió respecto de la sesión guardada,
   *    vuelve al paso de despacho.
   *
   * 4. Si el carrito no cambió, retoma el último paso.
   */
  const [
    currentStep,
    setCurrentStep,
  ] = useState<CheckoutStep>(() => {
    const queryParameters =
      new URLSearchParams(
        window.location.search
      );

    const paymentReturn =
      queryParameters.get(
        "payment"
      );

    if (
      paymentReturn === "failure" ||
      paymentReturn === "pending"
    ) {
      return "payment";
    }

    const storedCheckout =
      readStoredCheckout();

    if (!storedCheckout) {
      return "information";
    }

    const currentCartSignature =
      createCartSignature(
        cart
      );

    if (
      storedCheckout.cartSignature !==
      "" &&
      storedCheckout.cartSignature !==
        currentCartSignature
    ) {
      return "shipping";
    }

    return storedCheckout.currentStep;
  });

  const [
    informationData,
    setInformationData,
  ] =
    useState<GuestInformationData>(
      () =>
        readStoredCheckout()
          ?.informationData ??
        initialGuestInformation
    );

  const [
    addressData,
    setAddressData,
  ] =
    useState<CheckoutAddressData>(
      () =>
        readStoredCheckout()
          ?.addressData ??
        initialAddress
    );

  const [
    shippingMethod,
    setShippingMethod,
  ] =
    useState<ShippingMethod | null>(
      () =>
        readStoredCheckout()
          ?.shippingMethod ??
        null
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod | null>(
      () =>
        readStoredCheckout()
          ?.paymentMethod ??
        null
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
    () => {
      const pendingOrderId =
        readPendingOrderId();

      return pendingOrderId
        ? String(
            pendingOrderId
          )
        : null;
    }
  );

  /*
   * Completa los datos del comprador cuando
   * existe un usuario autenticado.
   */
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

  /*
   * Guarda continuamente la sesión del checkout.
   *
   * Conserva:
   *
   * - paso actual
   * - comprador
   * - dirección
   * - despacho
   * - pago
   * - firma del carrito
   */
  useEffect(() => {
    const storedState: StoredCheckoutState =
      {
        currentStep,
        informationData,
        addressData,
        shippingMethod,
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
    paymentMethod,
    cart,
  ]);

  /*
   * Procesa el regreso desde Mercado Pago.
   */
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
        Number(returnedOrderId);

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
      paymentReturn !== "failure" &&
      paymentReturn !== "pending"
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
      paymentReturn === "failure"
    ) {
      setPaymentNotice({
        type: "failure",
        message:
          "El pago no fue completado. Puedes revisar la información e intentarlo nuevamente con la misma orden.",
      });
    }

    if (
      paymentReturn === "pending"
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
          complementType === ""
            ? ""
            : previous
                .complementDetail,
      })
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

  const handlePayment =
    async () => {
      if (
        paymentMethod !==
        "mercado_pago"
      ) {
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

              total,
              shippingMethod,
            }
          );

        const checkoutUrl =
          response.data
            ?.checkoutUrl;

        const returnedOrderId =
          response.data
            ?.orderId;

        if (
          !checkoutUrl
        ) {
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

        /*
         * Antes de salir hacia Mercado Pago, registra
         * explícitamente el estado exacto de la compra.
         */
        const storedState: StoredCheckoutState =
          {
            currentStep:
              "payment",

            informationData,
            addressData,
            shippingMethod,
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
                data?: {
                  message?: string;
                } | string;
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

  /*
   * Se utiliza después de una compra completada.
   *
   * En ese caso sí corresponde limpiar:
   *
   * - sesión
   * - orden pendiente
   * - carrito
   */
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
                    setShippingMethod
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
                    shippingMethod ===
                    "home_delivery"
                      ? "Despacho a domicilio"
                      : "No seleccionado"
                  }
                  shippingDescription=""
                  shippingCost={0}
                  paymentMethod={
                    paymentMethod
                  }
                  cart={
                    cart
                  }
                  total={
                    total
                  }
                  isLoading={
                    isLoading
                  }
                  onBack={() =>
                    goToStep(
                      "payment"
                    )
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
              total={
                total
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;