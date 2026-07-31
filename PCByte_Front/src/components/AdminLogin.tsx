import React, { useState } from "react";
import {
  X,
  Lock,
  User,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";

import { authService } from "../services/authService";

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

const ADMIN_TOKEN_STORAGE_KEY =
  "admin_auth_token";

const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onClose,
}) => {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const session =
        await authService.login(
          email,
          password
        );

      if (
        session.user.role !==
        "ADMIN"
      ) {
        localStorage.removeItem(
          ADMIN_TOKEN_STORAGE_KEY
        );

        setErrorMessage(
          "La cuenta ingresada no tiene permisos administrativos."
        );

        return;
      }

      localStorage.setItem(
        ADMIN_TOKEN_STORAGE_KEY,
        session.authToken
      );

      onLoginSuccess();
    } catch {
      localStorage.removeItem(
        ADMIN_TOKEN_STORAGE_KEY
      );

      setErrorMessage(
        "Correo o contraseña incorrectos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-md">
      <div
        className={`w-full max-w-md overflow-hidden rounded-[2.5rem] border-[0.5px] bg-white shadow-2xl transition-all duration-300 ${
          errorMessage
            ? "animate-shake border-red-500"
            : "border-slate-200 hover:border-[#97cf00]"
        }`}
      >
        <div className="relative flex h-32 items-center justify-center overflow-hidden bg-slate-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#97cf00_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Cerrar acceso administrativo"
          >
            <X size={20} />
          </button>

          <div className="relative flex flex-col items-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#97cf00] shadow-lg shadow-[#97cf00]/20">
              <ShieldCheck
                size={24}
                className="text-slate-900"
              />
            </div>

            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
              Acceso{" "}
              <span className="text-[#0066FF]">
                Core
              </span>
            </h2>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 md:p-10"
        >
          <div className="space-y-4">
            <div className="group relative">
              <label
                htmlFor="admin-email"
                className="ml-1 text-[9px] font-black uppercase tracking-widest text-slate-400"
              >
                Correo administrativo
              </label>

              <div className="relative mt-1">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#0066FF]"
                />

                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border-[0.5px] border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 caret-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-[#0066FF] focus:bg-white focus:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="admin@pcbyte.cl"
                  autoComplete="username"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="group relative">
              <label
                htmlFor="admin-password"
                className="ml-1 text-[9px] font-black uppercase tracking-widest text-slate-400"
              >
                Código de seguridad
              </label>

              <div className="relative mt-1">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#97cf00]"
                />

                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  className="w-full rounded-2xl border-[0.5px] border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-sm font-bold text-slate-900 caret-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-[#97cf00] focus:bg-white focus:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="text-center text-[10px] font-black uppercase leading-relaxed text-red-500"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-[#0066FF] py-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-[#97cf00] hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-[#0066FF] disabled:hover:text-white"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
                Autenticando
              </>
            ) : (
              "Ingresar al sistema"
            )}
          </button>

          <p className="text-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
            ASTHOOD SECURITY PROTOCOL v1.0
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;