import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";

import type {
  ProfileFormProps,
} from "../types/profile";

import ProfileInput from "./ProfileInput";

const ProfileForm = ({
  profile,
  formData,
  isEditing,
  saving,
  saveError,
  validationError,
  successMessage,
  hasChanges,
  phoneHasError,
  phoneHasSuccess,
  phoneHelperText,
  onChange,
  onPhoneBlur,
  onSubmit,
  onCancel,
}: ProfileFormProps) => {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Datos de la cuenta
          </p>

          <h2 className="mt-2 text-xl font-black text-slate-900">
            Información personal
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Mantén tus datos actualizados para facilitar tus compras y comunicaciones.
          </p>
        </div>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-[#97cf00]/40 bg-[#97cf00]/10 px-4 py-3"
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-[#6f9900]"
          />

          <p className="text-sm font-semibold text-[#527300]">
            {successMessage}
          </p>
        </div>
      )}

      {(validationError || saveError) && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3"
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-500"
          />

          <p className="text-sm font-semibold text-red-600">
            {validationError || saveError}
          </p>
        </div>
      )}

      <form
        className="mt-7"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="grid gap-5 md:grid-cols-2">
          <ProfileInput
            label="Nombre"
            name="firstName"
            value={formData.firstName}
            placeholder="Ingresa tu nombre"
            icon={<UserRound size={17} />}
            maxLength={100}
            disabled={!isEditing || saving}
            required
            autoComplete="given-name"
            onChange={onChange}
          />

          <ProfileInput
            label="Apellido"
            name="lastName"
            value={formData.lastName}
            placeholder="Ingresa tu apellido"
            icon={<UserRound size={17} />}
            maxLength={100}
            disabled={!isEditing || saving}
            required
            autoComplete="family-name"
            onChange={onChange}
          />

          <ProfileInput
            label="Correo electrónico"
            name="email"
            type="email"
            value={profile.email}
            placeholder="Correo electrónico"
            icon={<Mail size={17} />}
            maxLength={255}
            disabled
            autoComplete="email"
            helperText="El correo electrónico no puede modificarse desde esta sección."
            onChange={() => undefined}
          />

          <ProfileInput
            label="Teléfono"
            name="phone"
            type="tel"
            inputMode="tel"
            value={formData.phone}
            placeholder="+56 9 1234 5678"
            icon={<Phone size={17} />}
            maxLength={25}
            disabled={!isEditing || saving}
            optional
            autoComplete="tel"
            error={phoneHasError}
            success={phoneHasSuccess}
            helperText={phoneHelperText}
            onBlur={onPhoneBlur}
            onChange={onChange}
          />
        </div>

        {isEditing && (
          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-black uppercase text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X size={17} />
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                !hasChanges ||
                phoneHasError
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-xs font-black uppercase text-white transition hover:bg-[#0052cc] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Guardando
                </>
              ) : (
                <>
                  <Save size={17} />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default ProfileForm;