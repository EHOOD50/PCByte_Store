import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import adminApi from "../api/adminApi";

interface PaymentOrder {
  id?: number;
  fullName?: string;
  status?: string;
  paymentId?: string | number;
}

type PageStatus =
  | "loading"
  | "success"
  | "error";

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

const SuccessPage: React.FC = () => {
  const [searchParams] =
    useSearchParams();

  const navigate = useNavigate();

  const [order, setOrder] =
    useState<PaymentOrder | null>(null);

  const [pageStatus, setPageStatus] =
    useState<PageStatus>("loading");

  const [retryCount, setRetryCount] =
    useState(0);

  const externalReference =
    searchParams.get(
      "external_reference"
    );

  useEffect(() => {
    let retryTimer:
      | ReturnType<typeof setTimeout>
      | undefined;

    const fetchOrder = async () => {
      if (!externalReference) {
        setPageStatus("error");
        return;
      }

      try {
        const response =
          await adminApi.get<PaymentOrder>(
            `/payments/order/${externalReference}`
          );

        const fetchedOrder =
          response.data;

        setOrder(fetchedOrder);

        if (
          fetchedOrder.status ===
          "PAGADO"
        ) {
          localStorage.removeItem(
            "pcbyte_cart_v1"
          );

          localStorage.removeItem(
            "cart"
          );

          window.dispatchEvent(
            new Event("storage")
          );

          setPageStatus("success");
          return;
        }

        if (
          retryCount >= MAX_RETRIES
        ) {
          setPageStatus("error");
          return;
        }

        retryTimer = window.setTimeout(
          () => {
            setRetryCount(
              (previous) =>
                previous + 1
            );
          },
          RETRY_DELAY
        );
      } catch (error) {
        console.error(
          "Error al consultar el pedido:",
          error
        );

        if (
          retryCount >= MAX_RETRIES
        ) {
          setPageStatus("error");
          return;
        }

        retryTimer = window.setTimeout(
          () => {
            setRetryCount(
              (previous) =>
                previous + 1
            );
          },
          RETRY_DELAY
        );
      }
    };

    void fetchOrder();

    return () => {
      if (retryTimer) {
        window.clearTimeout(
          retryTimer
        );
      }
    };
  }, [
    externalReference,
    retryCount,
  ]);

  if (pageStatus === "loading") {
    return (
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]">
        <Loader2
          className="mb-4 animate-spin text-[#97cf00]"
          size={50}
        />

        <p className="text-[10px] font-black uppercase tracking-widest text-white">
          Sincronizando con
          PCByte...
        </p>

        <p className="mt-3 text-xs text-slate-500">
          Confirmando el pago y
          preparando tu pedido.
        </p>
      </div>
    );
  }

  if (pageStatus === "error") {
    return (
      <div className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center overflow-hidden">
        <img
          src="/fondo2.jpg"
          className="absolute inset-0 z-0 h-full w-full object-cover"
          alt=""
        />

        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-lg rounded-[3rem] border-t-8 border-amber-500 bg-[#111]/90 p-6 text-center shadow-2xl">
          <AlertCircle
            size={72}
            className="mx-auto mb-6 text-amber-500"
          />

          <h1 className="mb-3 text-2xl font-black uppercase italic text-white">
            Pago en verificación
          </h1>

          <p className="mb-8 text-sm leading-relaxed text-slate-400">
            No pudimos confirmar el
            pedido todavía. Tu carrito
            no fue eliminado. Puedes
            volver a intentarlo en unos
            minutos.
          </p>

          <button
            type="button"
            onClick={() =>
              setRetryCount(0)
            }
            className="mb-3 w-full rounded-2xl bg-amber-500 py-4 text-xs font-black uppercase text-black transition hover:bg-white"
          >
            Volver a verificar
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="w-full rounded-2xl border border-white/10 py-4 text-xs font-black uppercase text-white transition hover:bg-white/10"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const customerFirstName =
    order?.fullName
      ?.trim()
      .split(/\s+/)[0];

  return (
    <div className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center overflow-hidden">
      <img
        src="/fondo2.jpg"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        alt=""
      />

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-lg rounded-[3rem] border-t-8 border-[#97cf00] bg-[#111]/90 p-6 text-center shadow-2xl">
        <CheckCircle2
          size={80}
          className="mx-auto mb-6 text-[#97cf00]"
        />

        <h1 className="mb-2 text-3xl font-black uppercase italic text-white">
          ¡Pago exitoso!
        </h1>

        <p className="mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          {customerFirstName
            ? `Gracias ${customerFirstName}, estamos preparando tu pedido.`
            : "Tu pago ha sido confirmado."}
        </p>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
          <div className="mb-2 flex items-center justify-between gap-4">
            <span className="text-[9px] font-black uppercase text-gray-500">
              Orden
            </span>

            <span className="break-all text-right font-mono font-bold text-[#97cf00]">
              #{externalReference}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase text-gray-500">
              Estado
            </span>

            <span className="text-[10px] font-black uppercase text-[#0066FF]">
              {order?.status}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/")
          }
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#97cf00] py-5 font-black uppercase italic text-black transition-all hover:bg-white"
        >
          Volver al inicio
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;