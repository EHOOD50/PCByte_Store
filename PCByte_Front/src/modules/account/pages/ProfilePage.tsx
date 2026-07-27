import {
  AlertCircle,
  CheckCircle2,
  Edit3,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  RefreshCw,
  Save,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  useAuth,
} from "../../../hooks/useAuth";

import ChangePasswordModal from "../components/ChangePasswordModal";

import useProfile from "../hooks/useProfile";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

const emptyProfileForm: ProfileFormData = {
  firstName: "",
  lastName: "",
  phone: "",
};

const ProfilePage = () => {
  const {
    user,
    authToken,
    isLoadingAuth,
    updateUser,
  } = useAuth();

  const {
    profile,
    loading,
    saving,
    error,
    saveError,
    reloadProfile,
    saveProfile,
  } = useProfile(
    authToken
  );

  const [
    formData,
    setFormData,
  ] = useState<ProfileFormData>({
    ...emptyProfileForm,
  });

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    isPasswordModalOpen,
    setIsPasswordModalOpen,
  ] = useState(false);

  const [
    validationError,
    setValidationError,
  ] = useState<string | null>(
    null
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormData({
      firstName:
        profile.firstName ?? "",

      lastName:
        profile.lastName ?? "",

      phone:
        profile.phone ?? "",
    });
  }, [
    profile,
  ]);

  const fullName =
    useMemo(() => {
      if (!profile) {
        return "";
      }

      return [
        profile.firstName,
        profile.lastName,
      ]
        .filter(Boolean)
        .join(" ");
    }, [
      profile,
    ]);

  const initials =
    useMemo(() => {
      if (!profile) {
        return "PC";
      }

      const firstInitial =
        profile.firstName
          ?.trim()
          .charAt(0) ?? "";

      const lastInitial =
        profile.lastName
          ?.trim()
          .charAt(0) ?? "";

      return (
        `${firstInitial}${lastInitial}`
          .toUpperCase() ||
        "PC"
      );
    }, [
      profile,
    ]);

  const hasChanges =
    useMemo(() => {
      if (!profile) {
        return false;
      }

      return (
        formData.firstName.trim() !==
          profile.firstName.trim() ||
        formData.lastName.trim() !==
          profile.lastName.trim() ||
        formData.phone.trim() !==
          (profile.phone ?? "").trim()
      );
    }, [
      formData,
      profile,
    ]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (currentForm) => ({
        ...currentForm,
        [name]: value,
      })
    );

    setValidationError(null);
    setSuccessMessage(null);
  };

  const handleEdit = () => {
    if (!profile) {
      return;
    }

    setFormData({
      firstName:
        profile.firstName,

      lastName:
        profile.lastName,

      phone:
        profile.phone ?? "",
    });

    setValidationError(null);
    setSuccessMessage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (saving) {
      return;
    }

    if (profile) {
      setFormData({
        firstName:
          profile.firstName,

        lastName:
          profile.lastName,

        phone:
          profile.phone ?? "",
      });
    }

    setValidationError(null);
    setSuccessMessage(null);
    setIsEditing(false);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const firstName =
      formData.firstName.trim();

    const lastName =
      formData.lastName.trim();

    const phone =
      formData.phone.trim();

    if (!firstName) {
      setValidationError(
        "El nombre es obligatorio."
      );

      return;
    }

    if (!lastName) {
      setValidationError(
        "El apellido es obligatorio."
      );

      return;
    }

    if (
      firstName.length > 100 ||
      lastName.length > 100
    ) {
      setValidationError(
        "El nombre y el apellido no pueden superar los 100 caracteres."
      );

      return;
    }

    if (phone.length > 30) {
      setValidationError(
        "El teléfono no puede superar los 30 caracteres."
      );

      return;
    }

    try {
      setValidationError(null);
      setSuccessMessage(null);

      const updatedProfile =
        await saveProfile({
          firstName,
          lastName,
          phone:
            phone || null,
        });

      updateUser(
        updatedProfile
      );

      setFormData({
        firstName:
          updatedProfile.firstName,

        lastName:
          updatedProfile.lastName,

        phone:
          updatedProfile.phone ?? "",
      });

      setIsEditing(false);

      setSuccessMessage(
        "Tus datos fueron actualizados correctamente."
      );
    } catch {
      /*
       * El mensaje se obtiene desde saveError.
       */
    }
  };

  if (isLoadingAuth) {
    return (
      <LoadingPanel
        title="Cargando tu cuenta"
        description="Estamos recuperando la información de tu sesión."
      />
    );
  }

  if (!user || !authToken) {
    return (
      <section className="rounded-[2rem] border border-amber-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
          <AlertCircle
            size={27}
          />
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-900">
          Sesión no disponible
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
          Debes iniciar sesión para consultar y editar tus datos personales.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <LoadingPanel
        title="Cargando tus datos"
        description="Estamos consultando la información de tu perfil."
      />
    );
  }

  if (error || !profile) {
    return (
      <section className="rounded-[2rem] border border-red-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <AlertCircle
            size={27}
          />
        </div>

        <h2 className="mt-5 text-xl font-black text-slate-900">
          No pudimos cargar tus datos
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
          {error ??
            "No fue posible obtener la información de tu perfil."}
        </p>

        <button
          type="button"
          onClick={() => {
            void reloadProfile();
          }}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 py-3 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
        >
          <RefreshCw size={16} />
          Intentar nuevamente
        </button>
      </section>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
            Información personal
          </p>

          <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-xl font-black text-[#0066FF]">
                {initials}
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  Mis datos
                </h1>

                <p className="mt-2 text-sm font-bold text-slate-700">
                  {fullName}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Administra la información asociada a tu Cuenta PCByte.
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
              >
                <Edit3 size={17} />
                Editar datos
              </button>
            )}
          </div>
        </section>

        {successMessage && (
          <section className="flex items-start gap-3 rounded-2xl border border-[#97cf00]/40 bg-[#97cf00]/10 px-5 py-4">
            <CheckCircle2
              size={20}
              className="mt-0.5 shrink-0 text-[#6f9900]"
            />

            <p className="text-sm font-bold text-[#527200]">
              {successMessage}
            </p>
          </section>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Datos personales
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Mantén actualizada tu información de contacto.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6"
            >
              {(validationError ||
                saveError) && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <p className="text-sm font-bold text-red-600">
                    {validationError ??
                      saveError}
                  </p>
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <ProfileInput
                  label="Nombre"
                  name="firstName"
                  value={
                    formData.firstName
                  }
                  placeholder="Tu nombre"
                  icon={
                    <UserRound
                      size={17}
                    />
                  }
                  maxLength={100}
                  disabled={
                    !isEditing ||
                    saving
                  }
                  onChange={
                    handleChange
                  }
                  required
                />

                <ProfileInput
                  label="Apellido"
                  name="lastName"
                  value={
                    formData.lastName
                  }
                  placeholder="Tu apellido"
                  icon={
                    <UserRound
                      size={17}
                    />
                  }
                  maxLength={100}
                  disabled={
                    !isEditing ||
                    saving
                  }
                  onChange={
                    handleChange
                  }
                  required
                />
              </div>

              <div className="mt-5">
                <ProfileInput
                  label="Teléfono"
                  name="phone"
                  value={
                    formData.phone
                  }
                  placeholder="Ej.: +56 9 1234 5678"
                  icon={
                    <Phone
                      size={17}
                    />
                  }
                  maxLength={30}
                  disabled={
                    !isEditing ||
                    saving
                  }
                  onChange={
                    handleChange
                  }
                  optional
                />
              </div>

              <div className="mt-5">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Correo electrónico
                </div>

                <div className="relative mt-1.5">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  />

                  <input
                    type="email"
                    value={
                      profile.email
                    }
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 pl-11 pr-4 text-sm font-bold text-slate-500 outline-none"
                  />
                </div>

                <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-slate-400">
                  <LockKeyhole
                    size={14}
                    className="mt-0.5 shrink-0"
                  />

                  <p>
                    El correo identifica tu cuenta y no puede modificarse desde esta sección.
                  </p>
                </div>
              </div>

              {isEditing && (
                <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={
                      handleCancel
                    }
                    disabled={
                      saving
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-xs font-black uppercase text-slate-500 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={
                      saving ||
                      !hasChanges
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#97cf00] px-5 text-xs font-black uppercase text-slate-900 transition hover:bg-[#86b900] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                  >
                    {saving ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />

                        Guardando...
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

          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00]/15 text-[#6f9900]">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6f9900]">
                    Estado de la cuenta
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Cuenta registrada
                  </h2>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#97cf00]/30 bg-[#97cf00]/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Estado
                  </span>

                  <span className="rounded-full bg-[#97cf00]/20 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#527200]">
                    {profile.status}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Tu cuenta se encuentra habilitada para realizar compras, administrar direcciones y consultar pedidos.
              </p>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
                  <KeyRound size={21} />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                    Seguridad
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Contraseña
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                Utiliza una contraseña segura y evita compartirla con otras personas.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSuccessMessage(
                    null
                  );

                  setIsPasswordModalOpen(
                    true
                  );
                }}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-4 text-xs font-black uppercase text-white transition hover:bg-[#0052cc]"
              >
                <KeyRound size={16} />
                Cambiar contraseña
              </button>
            </section>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={
          isPasswordModalOpen
        }
        onClose={() =>
          setIsPasswordModalOpen(
            false
          )
        }
        onSuccess={
          setSuccessMessage
        }
      />
    </>
  );
};

interface ProfileInputProps {
  label: string;
  name: keyof ProfileFormData;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  maxLength: number;
  disabled: boolean;
  required?: boolean;
  optional?: boolean;
  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
}

const ProfileInput = ({
  label,
  name,
  value,
  placeholder,
  icon,
  maxLength,
  disabled,
  required = false,
  optional = false,
  onChange,
}: ProfileInputProps) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-wider text-slate-500"
      >
        {label}

        {optional && (
          <span className="text-[8px] font-bold normal-case tracking-normal text-slate-400">
            (opcional)
          </span>
        )}
      </label>

      <div className="relative mt-1.5">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </div>

        <input
          id={name}
          name={name}
          type="text"
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          onChange={onChange}
          className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:border-[#0066FF] focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
        />
      </div>
    </div>
  );
};

interface LoadingPanelProps {
  title: string;
  description: string;
}

const LoadingPanel = ({
  title,
  description,
}: LoadingPanelProps) => {
  return (
    <section className="flex min-h-72 items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <Loader2
          size={34}
          className="mx-auto animate-spin text-[#0066FF]"
        />

        <p className="mt-4 text-sm font-black text-slate-800">
          {title}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </section>
  );
};

export default ProfilePage;