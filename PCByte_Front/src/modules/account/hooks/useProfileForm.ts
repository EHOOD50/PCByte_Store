import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";

import {
  formatPhone,
  isValidPhone,
  normalizePhone,
} from "../../../utils/phoneUtils";

import type {
  ProfileData,
  ProfileFormData,
  UpdateProfileRequest,
} from "../types/profile";

interface UseProfileFormProps {
  profile: ProfileData | null;
  saving: boolean;

  saveProfile: (
    request: UpdateProfileRequest
  ) => Promise<ProfileData>;

  updateUser: (
    updatedUser: ProfileData
  ) => void;
}

const createFormData = (
  profile: ProfileData | null
): ProfileFormData => {
  if (!profile) {
    return {
      firstName: "",
      lastName: "",
      phone: "",
    };
  }

  return {
    firstName:
      profile.firstName ?? "",

    lastName:
      profile.lastName ?? "",

    phone:
      profile.phone
        ? formatPhone(
            profile.phone
          )
        : "",
  };
};

const useProfileForm = ({
  profile,
  saving,
  saveProfile,
  updateUser,
}: UseProfileFormProps) => {
  const [
    formData,
    setFormData,
  ] =
    useState<ProfileFormData>(
      () =>
        createFormData(
          profile
        )
    );

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    phoneTouched,
    setPhoneTouched,
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
    if (
      !profile ||
      isEditing
    ) {
      return;
    }

    setFormData(
      createFormData(
        profile
      )
    );

    setPhoneTouched(false);
  }, [
    profile,
    isEditing,
  ]);

  const phoneValue =
    formData.phone.trim();

  const phoneIsValid =
    useMemo(() => {
      return isValidPhone(
        phoneValue
      );
    }, [
      phoneValue,
    ]);

  const phoneHasError =
    phoneTouched &&
    phoneValue.length > 0 &&
    !phoneIsValid;

  const phoneHasSuccess =
    phoneTouched &&
    phoneValue.length > 0 &&
    phoneIsValid;

  const phoneHelperText =
    useMemo(() => {
      if (phoneHasError) {
        return "Ingresa un teléfono chileno válido. Ej.: +56 9 1234 5678.";
      }

      if (phoneHasSuccess) {
        return "Número de teléfono válido.";
      }

      return "Puedes ingresar un teléfono móvil o fijo de Chile.";
    }, [
      phoneHasError,
      phoneHasSuccess,
    ]);

  const hasChanges =
    useMemo(() => {
      if (!profile) {
        return false;
      }

      const currentFirstName =
        formData.firstName.trim();

      const currentLastName =
        formData.lastName.trim();

      const currentPhone =
        normalizePhone(
          formData.phone
        );

      const originalFirstName =
        (
          profile.firstName ??
          ""
        ).trim();

      const originalLastName =
        (
          profile.lastName ??
          ""
        ).trim();

      const originalPhone =
        normalizePhone(
          profile.phone ?? ""
        );

      return (
        currentFirstName !==
          originalFirstName ||
        currentLastName !==
          originalLastName ||
        currentPhone !==
          originalPhone
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

    if (name === "phone") {
      setPhoneTouched(true);
    }

    setValidationError(null);
    setSuccessMessage(null);
  };

  const handlePhoneBlur = (
    event: FocusEvent<HTMLInputElement>
  ) => {
    const value =
      event.target.value.trim();

    setPhoneTouched(true);

    if (
      !value ||
      !isValidPhone(value)
    ) {
      return;
    }

    setFormData(
      (currentForm) => ({
        ...currentForm,
        phone:
          formatPhone(
            value
          ),
      })
    );
  };

  const handleEdit = () => {
    if (!profile) {
      return;
    }

    setFormData(
      createFormData(
        profile
      )
    );

    setPhoneTouched(false);
    setValidationError(null);
    setSuccessMessage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (saving) {
      return;
    }

    setFormData(
      createFormData(
        profile
      )
    );

    setPhoneTouched(false);
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

    const rawPhone =
      formData.phone.trim();

    setPhoneTouched(true);
    setValidationError(null);
    setSuccessMessage(null);

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
      firstName.length > 100
    ) {
      setValidationError(
        "El nombre no puede superar los 100 caracteres."
      );

      return;
    }

    if (
      lastName.length > 100
    ) {
      setValidationError(
        "El apellido no puede superar los 100 caracteres."
      );

      return;
    }

    if (
      rawPhone &&
      !isValidPhone(rawPhone)
    ) {
      setValidationError(
        "Ingresa un teléfono chileno válido."
      );

      return;
    }

    const normalizedPhone =
      rawPhone
        ? normalizePhone(
            rawPhone
          )
        : "";

    try {
      const updatedProfile =
        await saveProfile({
          firstName,
          lastName,

          phone:
            normalizedPhone ||
            null,
        });

      updateUser(
        updatedProfile
      );

      setFormData(
        createFormData(
          updatedProfile
        )
      );

      setPhoneTouched(false);
      setIsEditing(false);

      setSuccessMessage(
        "Tus datos fueron actualizados correctamente."
      );
    } catch {
      /*
       * El error enviado por el backend
       * se obtiene mediante saveError
       * desde useProfile.
       */
    }
  };

  const clearSuccessMessage =
    () => {
      setSuccessMessage(
        null
      );
    };

  return {
    formData,
    isEditing,
    validationError,
    successMessage,
    hasChanges,

    phoneTouched,
    phoneIsValid,
    phoneHasError,
    phoneHasSuccess,
    phoneHelperText,

    handleChange,
    handlePhoneBlur,
    handleEdit,
    handleCancel,
    handleSubmit,

    setSuccessMessage,
    clearSuccessMessage,
  };
};

export default useProfileForm;