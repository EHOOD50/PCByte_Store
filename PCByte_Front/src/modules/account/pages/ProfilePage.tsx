import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useAuth,
} from "../../../hooks/useAuth";

import ChangePasswordModal from "../components/ChangePasswordModal";
import LoadingPanel from "../components/LoadingPanel";
import ProfileForm from "../components/ProfileForm";
import ProfileHeader from "../components/ProfileHeader";
import ProfileSecurityCard from "../components/ProfileSecurityCard";
import ProfileStatusCard from "../components/ProfileStatusCard";

import useProfile from "../hooks/useProfile";
import useProfileForm from "../hooks/useProfileForm";

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
    isPasswordModalOpen,
    setIsPasswordModalOpen,
  ] = useState(false);

  const {
    formData,
    isEditing,
    validationError,
    successMessage,
    hasChanges,

    phoneHasError,
    phoneHasSuccess,
    phoneHelperText,

    handleChange,
    handlePhoneBlur,
    handleEdit,
    handleCancel,
    handleSubmit,

    setSuccessMessage,
  } = useProfileForm({
    profile,
    saving,
    saveProfile,
    updateUser,
  });

  const handleOpenPasswordModal =
    () => {
      setSuccessMessage(null);
      setIsPasswordModalOpen(true);
    };

  const handleClosePasswordModal =
    () => {
      setIsPasswordModalOpen(false);
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
          <AlertCircle size={27} />
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
          <AlertCircle size={27} />
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
        <ProfileHeader
          profile={profile}
          isEditing={isEditing}
          onEdit={handleEdit}
        />

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <ProfileForm
            profile={profile}
            formData={formData}
            isEditing={isEditing}
            saving={saving}
            saveError={saveError}
            validationError={validationError}
            successMessage={successMessage}
            hasChanges={hasChanges}
            phoneHasError={phoneHasError}
            phoneHasSuccess={phoneHasSuccess}
            phoneHelperText={phoneHelperText}
            onChange={handleChange}
            onPhoneBlur={handlePhoneBlur}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          <div className="space-y-6">
            <ProfileStatusCard
              status={profile.status}
            />

            <ProfileSecurityCard
              email={profile.email}
              onOpenPasswordModal={
                handleOpenPasswordModal
              }
            />
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        onSuccess={setSuccessMessage}
      />
    </>
  );
};

export default ProfilePage;