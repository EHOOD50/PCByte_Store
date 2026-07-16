import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  Copy,
  Loader2,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";

import adminApi from "../api/adminApi";
import logo from "../assets/logo.png";

interface SuccessPageProps {
  clearCart: () => void;
}

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

const SuccessPage: React.FC<SuccessPageProps> = ({
  clearCart,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [order, setOrder] =
    useState<PaymentOrder | null>(null);

  const [pageStatus, setPageStatus] =
    useState<PageStatus>("loading");

  const [retryCount, setRetryCount] =
    useState(0);

  const [orderCopied, setOrderCopied] =
    useState(false);

  const externalReference =
    searchParams.get("external_reference");

  const orderNumber =
    order?.id ??
    externalReference ??
    "-";

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

        const fetchedOrder = response.data;

        setOrder(fetchedOrder);

        if (fetchedOrder.status === "PAGADO") {
          clearCart();
          setPageStatus("success");
          return;
        }

        if (retryCount >= MAX_RETRIES) {
          setPageStatus("error");
          return;
        }

        retryTimer = window.setTimeout(
          () => {
            setRetryCount(
              (previous) => previous + 1
            );
          },
          RETRY_DELAY
        );
      } catch (error) {
        console.error(
          "Error al consultar el pedido:",
          error
        );

        if (retryCount >= MAX_RETRIES) {
          setPageStatus("error");
          return;
        }

        retryTimer = window.setTimeout(
          () => {
            setRetryCount(
              (previous) => previous + 1
            );
          },
          RETRY_DELAY
        );
      }
    };

    void fetchOrder();

    return () => {
      if (retryTimer) {
        window.clearTimeout(retryTimer);
      }
    };
  }, [
    externalReference,
    retryCount,
    clearCart,
  ]);

  const customerFirstName =
    order?.fullName
      ?.trim()
      .split(/\s+/)[0];

  const handleRetry = () => {
    setPageStatus("loading");
    setRetryCount(0);
  };

  const handleCopyOrder = async () => {
    try {
      await navigator.clipboard.writeText(
        String(orderNumber)
      );

      setOrderCopied(true);

      window.setTimeout(() => {
        setOrderCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "No se pudo copiar el número de orden:",
        error
      );
    }
  };

  if (pageStatus === "loading") {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-white px-5 py-10">
        <section className="w-full max-w-md text-center">
          <img
            src={logo}
            alt="PCByte"
            className="mx-auto h-auto w-44 object-contain"
          />

          <div className="mx-auto mt-12 flex h-16 w-16 items-center justify-center rounded-full bg-[#97cf00]/10">
            <Loader2
              size={30}
              className="animate-spin text-[#78a900]"
            />
          </div>

          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.28em] text-[#0066FF]">
            Confirmación de pago
          </p>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
            Estamos verificando tu compra
          </h1>

          <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">
            Espera unos segundos mientras
            confirmamos la operación con
            Mercado Pago.
          </p>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <ShieldCheck size={16} />
            Proceso protegido
          </div>
        </section>
      </main>
    );
  }

  if (pageStatus === "error") {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-white px-5 py-10">
        <section className="w-full max-w-lg text-center">
          <img
            src={logo}
            alt="PCByte"
            className="mx-auto h-auto w-44 object-contain"
          />

          <div className="mx-auto mt-12 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <AlertCircle
              size={32}
              className="text-amber-500"
            />
          </div>

          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.28em] text-amber-500">
            Pago en verificación
          </p>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
            Aún no recibimos la confirmación
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
            Tu carrito permanece intacto.
            Puedes volver a consultar el pago
            o regresar al catálogo.
          </p>

          {externalReference && (
            <div className="mx-auto mt-7 max-w-sm border-y border-slate-200 py-5">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Número de orden
              </p>

              <p className="mt-2 font-mono text-base font-bold text-slate-800">
                #{externalReference}
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-4 text-xs font-black uppercase text-white transition hover:bg-amber-600"
            >
              <Clock3 size={16} />
              Verificar nuevamente
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/productos")
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-xs font-black uppercase text-slate-700 transition hover:bg-slate-50"
            >
              Ir al catálogo
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-slate-900">
      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 md:py-14">
        <header className="flex justify-center border-b border-slate-200 pb-10">
          <img
            src={logo}
            alt="PCByte"
            className="h-auto w-48 object-contain sm:w-56"
          />
        </header>

        <section className="mx-auto max-w-3xl border-b border-slate-200 py-12 text-center md:py-16">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#97cf00]/12">
            <CheckCircle2
              size={44}
              className="text-[#78a900]"
            />
          </div>

          <p className="mt-7 text-[10px] font-black uppercase tracking-[0.3em] text-[#78a900]">
            Compra confirmada
          </p>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            ¡Gracias por tu compra
            {customerFirstName
              ? `, ${customerFirstName}`
              : ""}
            !
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Tu pedido fue confirmado
            correctamente y ya comenzó a ser
            procesado por nuestro equipo.
          </p>
        </section>

        <section className="grid border-b border-slate-200 md:grid-cols-2">
          <div className="border-b border-slate-200 py-10 md:border-b-0 md:border-r md:pr-12">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0066FF]">
              Estado actual
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-900">
              Seguimiento del pedido
            </h2>

            <div className="mt-8">
              <OrderStep
                icon={<Check size={17} />}
                title="Pago confirmado"
                description="La transacción fue validada por Mercado Pago."
                completed
                showLine
              />

              <OrderStep
                icon={
                  <PackageCheck size={17} />
                }
                title="Pedido recibido"
                description="Tu compra quedó registrada correctamente."
                completed
                showLine
              />

              <OrderStep
                icon={
                  <PackageCheck size={17} />
                }
                title="Preparando productos"
                description="Nuestro equipo revisará y preparará tu pedido."
                showLine
              />

              <OrderStep
                icon={<Truck size={17} />}
                title="Despacho"
                description="Te informaremos cuando el pedido sea enviado."
                showLine
              />

              <OrderStep
                icon={<Check size={17} />}
                title="Entregado"
                description="La compra llegará a la dirección registrada."
              />
            </div>
          </div>

          <aside className="py-10 md:pl-12">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#0066FF]">
              Información
            </p>

            <h2 className="mt-2 text-xl font-black text-slate-900">
              Resumen de la compra
            </h2>

            <div className="mt-8 space-y-5">
              <SummaryRow
                label="Número de orden"
                value={`#${orderNumber}`}
                action={
                  <button
                    type="button"
                    onClick={handleCopyOrder}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#0066FF] transition hover:text-[#004fc5]"
                  >
                    <Copy size={14} />
                    {orderCopied
                      ? "Copiado"
                      : "Copiar"}
                  </button>
                }
              />

              <SummaryRow
                label="Estado"
                value={
                  order?.status ?? "PAGADO"
                }
                highlighted
              />

              <SummaryRow
                label="Método de pago"
                value="Mercado Pago"
              />
            </div>

            <div className="mt-10 border-t border-slate-200 pt-8">
              <h3 className="text-sm font-black text-slate-900">
                ¿Qué ocurrirá ahora?
              </h3>

              <div className="mt-5 space-y-4">
                <NextStep text="Revisaremos los datos de tu pedido." />

                <NextStep text="Prepararemos cuidadosamente tus productos." />

                <NextStep text="Te informaremos cuando el pedido cambie de estado." />
              </div>
            </div>
          </aside>
        </section>

        <section className="py-10 text-center md:py-12">
          <button
            type="button"
            onClick={() =>
              navigate("/productos")
            }
            className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-8 py-4 text-sm font-black uppercase text-white transition hover:bg-[#0055d4] sm:w-auto sm:min-w-80"
          >
            Seguir comprando
            <ArrowRight size={18} />
          </button>
        </section>

        <footer className="border-t border-slate-200 pt-8 text-center">
          <p className="text-sm font-bold text-slate-700">
            ¿Necesitas ayuda?
          </p>

          <p className="mt-2 text-xs leading-6 text-slate-400">
            Comunícate con nuestro equipo de
            atención y ten a mano tu número de
            orden.
          </p>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
            PCByte · Tecnología que conecta
          </p>
        </footer>
      </div>
    </main>
  );
};

interface OrderStepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  completed?: boolean;
  showLine?: boolean;
}

const OrderStep: React.FC<OrderStepProps> = ({
  icon,
  title,
  description,
  completed = false,
  showLine = false,
}) => {
  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {showLine && (
        <div
          className={`absolute left-[17px] top-9 h-[calc(100%-1rem)] w-px ${
            completed
              ? "bg-[#97cf00]/50"
              : "bg-slate-200"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
          completed
            ? "border-[#97cf00]/40 bg-[#97cf00]/15 text-[#78a900]"
            : "border-slate-200 bg-white text-slate-400"
        }`}
      >
        {icon}
      </div>

      <div className="pt-0.5">
        <p className="text-sm font-black text-slate-800">
          {title}
        </p>

        <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
};

interface SummaryRowProps {
  label: string;
  value: string;
  highlighted?: boolean;
  action?: React.ReactNode;
}

const SummaryRow: React.FC<SummaryRowProps> = ({
  label,
  value,
  highlighted = false,
  action,
}) => {
  return (
    <div className="border-b border-slate-200 pb-5 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          {label}
        </span>

        {action}
      </div>

      <p
        className={`mt-2 break-all text-base font-black ${
          highlighted
            ? "text-[#78a900]"
            : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

interface NextStepProps {
  text: string;
}

const NextStep: React.FC<NextStepProps> = ({
  text,
}) => {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#97cf00]/15">
        <Check
          size={12}
          className="text-[#78a900]"
        />
      </div>

      <p className="text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
};

export default SuccessPage;