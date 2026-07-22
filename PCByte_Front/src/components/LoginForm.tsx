import React, {
  useState,
} from "react";

import {
  ArrowRight,
  ChevronLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import logo from "../assets/logo.png";
import { useAuth } from "../hooks/useAuth";

interface LoginFormProps {
  onLoginSuccess: () => void;
  onBack: () => void;
  onRegister: () => void;
}

export const LoginForm = ({
  onLoginSuccess,
  onBack,
  onRegister,
}: LoginFormProps) => {
  const { login } = useAuth();

  const [credentials, setCredentials] =
    useState({
      email: "",
      password: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } =
      event.target;

    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(
        credentials.email,
        credentials.password
      );

      onLoginSuccess();
    } catch (requestError) {
      console.error(
        "Error al iniciar sesión:",
        requestError
      );

      setError(
        "Correo o contraseña incorrectos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
              Cuenta PCByte
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              Inicia sesión en PCByte
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
              Accede a tu cuenta para continuar con tus compras y mantener organizada tu experiencia con PCByte.
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
              onClick={onRegister}
              className="flex items-center gap-2 rounded-xl bg-[#97cf00] px-4 py-3 text-[9px] font-black uppercase tracking-wider text-slate-900 transition hover:bg-[#86b900]"
            >
              <UserPlus size={15} />
              Crear cuenta
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[0.95fr_1.05fr] lg:p-7">
        {/* PANEL DE IDENTIDAD */}
        <section className="relative overflow-hidden rounded-[1.75rem] border border-[#0066FF]/15 bg-gradient-to-br from-[#08101d] via-[#0d1727] to-[#111827] p-7 text-white">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-full bg-[#0066FF]/10" />
          <div className="absolute bottom-0 left-0 h-28 w-28 rounded-tr-full bg-[#97cf00]/10" />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#97cf00]">
              <ShieldCheck size={23} />
            </div>

            <p className="mt-6 text-[9px] font-black uppercase tracking-[0.24em] text-[#97cf00]">
              Acceso seguro
            </p>

            <h2 className="mt-2 max-w-md text-3xl font-black tracking-tight">
              Tu Cuenta PCByte, siempre contigo
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Consulta tus compras, direcciones, pedidos y garantías desde un solo lugar.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs leading-6 text-slate-300">
                PCByte protege tus datos y utiliza tu información únicamente para gestionar tu cuenta y tus compras.
              </p>
            </div>
          </div>
        </section>

        {/* FORMULARIO */}
        <section className="flex items-center">
          <div className="mx-auto w-full max-w-xl rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#0066FF]">
                Bienvenido nuevamente
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                Ingresa a tu cuenta
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Usa el correo y la contraseña con los que te registraste.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
            >
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-500">
                  {error}
                </div>
              )}

              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Correo electrónico
                </label>

                <div className="relative mt-1.5">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={17}
                  />

                  <input
                    name="email"
                    type="email"
                    value={credentials.email}
                    placeholder="nombre@correo.cl"
                    required
                    autoComplete="email"
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:border-[#0066FF] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Contraseña
                </label>

                <div className="relative mt-1.5">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={17}
                  />

                  <input
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={credentials.password}
                    placeholder="Tu contraseña"
                    required
                    autoComplete="current-password"
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:border-[#0066FF] focus:bg-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0066FF]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-[50px] w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 text-xs font-black uppercase text-white transition hover:bg-[#0066FF] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2
                      className="animate-spin"
                      size={18}
                    />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar sesión

                    <ArrowRight
                      size={18}
                      className="text-[#97cf00] transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 border-t border-slate-200 pt-5 text-center">
              <p className="text-xs text-slate-500">
                ¿Aún no tienes una Cuenta PCByte?
              </p>

              <button
                type="button"
                onClick={onRegister}
                className="mt-2 inline-flex items-center gap-2 text-sm font-black text-[#0066FF] transition hover:text-[#0055d4]"
              >
                Crear mi Cuenta PCByte
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};