import React from "react";
import {
  ArrowRight,
  ChevronLeft,
  LogIn,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";

import logo from "../assets/logo.png";

interface CheckoutSelectionProps {
  onGuestContinue: () => void;
  onLoginSuccess: () => void;
  onRegister: () => void;
  onBack: () => void;
}

export const CheckoutSelection = ({
  onGuestContinue,
  onLoginSuccess,
  onRegister,
  onBack,
}: CheckoutSelectionProps) => {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-[#f8fbff] to-[#f7fbef] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] items-center px-5 py-3 sm:px-8 lg:px-12">
        <div className="w-full overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.11)]">
          {/* CABECERA INTEGRADA */}
          <header className="border-b border-slate-100 bg-gradient-to-r from-[#f7fbef] via-white to-[#f3f7ff] px-6 py-4 sm:px-8">
            <div className="grid items-center gap-4 lg:grid-cols-[auto_1fr_auto]">
              <img
                src={logo}
                alt="PCByte"
                className="mx-auto h-auto w-48 object-contain sm:w-56 lg:mx-0"
              />

              <div className="text-center lg:border-l lg:border-slate-200 lg:pl-7 lg:text-left">
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0066FF]">
                  Bienvenido a PCByte
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
                  Elige cómo deseas continuar
                </h1>

                <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500 sm:text-sm">
                  Puedes continuar como invitado o acceder a tu Cuenta
                  PCByte para mantener organizada tu experiencia con
                  nosotros.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                >
                  <ChevronLeft size={15} />
                  Volver al catálogo
                </button>

                <button
                  type="button"
                  onClick={onLoginSuccess}
                  className="flex items-center gap-2 rounded-xl bg-[#0066FF] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-white transition hover:bg-[#0055d4]"
                >
                  <LogIn size={15} />
                  Ya tengo cuenta
                </button>
              </div>
            </div>
          </header>

          {/* OPCIONES */}
          <section className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[0.85fr_1.15fr] lg:p-7">
            {/* INVITADO */}
            <article className="flex min-h-[390px] flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#6f9900]">
                <ShoppingBag size={22} />
              </div>

              <p className="mt-6 text-[9px] font-black uppercase tracking-[0.24em] text-slate-400">
                Invitado
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                Continuar como invitado
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                Si prefieres no crear una cuenta en este momento, puedes
                continuar directamente con tu compra.
              </p>

              <div className="mt-auto pt-8">
                <button
                  type="button"
                  onClick={onGuestContinue}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-xs font-black uppercase text-white transition hover:bg-black"
                >
                  Continuar como invitado
                  <ArrowRight size={17} />
                </button>
              </div>
            </article>

            {/* CUENTA PCBYTE */}
            <article className="relative flex min-h-[390px] flex-col overflow-hidden rounded-[1.75rem] border-2 border-[#0066FF] bg-gradient-to-br from-[#f8fbff] via-white to-[#f7fbef] p-6 shadow-[0_18px_50px_rgba(0,102,255,0.10)]">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-[#97cf00]/10" />

              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
                <UserRound size={23} />
              </div>

              <p className="relative mt-6 text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
                Cuenta PCByte
              </p>

              <h2 className="relative mt-2 text-2xl font-black tracking-tight text-slate-900">
                Mantén tu experiencia PCByte en un solo lugar
              </h2>

              <p className="relative mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                Accede a tu cuenta para mantener organizadas tus compras,
                direcciones, pedidos y garantías.
              </p>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                <FeatureItem
                  icon={<ShoppingBag size={15} />}
                  text="Historial de compras"
                />

                <FeatureItem
                  icon={<MapPin size={15} />}
                  text="Direcciones guardadas"
                />

                <FeatureItem
                  icon={<PackageCheck size={15} />}
                  text="Seguimiento de pedidos"
                />

                <FeatureItem
                  icon={<ShieldCheck size={15} />}
                  text="Garantías organizadas"
                />
              </div>

              <div className="relative mt-auto grid gap-3 pt-7 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={onLoginSuccess}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-6 py-4 text-xs font-black uppercase text-white transition hover:bg-[#0055d4]"
                >
                  Iniciar sesión
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={onRegister}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#97cf00]/40 bg-[#97cf00]/10 px-6 py-4 text-xs font-black uppercase text-[#5f8200] transition hover:bg-[#97cf00] hover:text-slate-900"
                >
                  Crear cuenta
                  <ArrowRight size={17} />
                </button>
              </div>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  text: string;
}

const FeatureItem = ({
  icon,
  text,
}: FeatureItemProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/80 px-4 py-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#97cf00]/15 text-[#6f9900]">
        {icon}
      </div>

      <p className="text-xs font-bold text-slate-600">
        {text}
      </p>
    </div>
  );
};

export default CheckoutSelection;