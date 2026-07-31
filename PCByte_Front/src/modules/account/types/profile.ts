import type {
  ChangeEvent,
  FocusEvent,
  FormEvent,
} from "react";

import type {
  AuthUser,
  UserStatus,
} from "../../../types/auth";

export type ProfileData = AuthUser;

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string | null;
}

export interface ProfileFormValidation {
  phoneTouched: boolean;
  phoneIsValid: boolean;
  phoneHasError: boolean;
  phoneHasSuccess: boolean;
  phoneHelperText: string;
}

export interface ProfileFormState {
  formData: ProfileFormData;
  isEditing: boolean;
  saving: boolean;
  validationError: string | null;
  successMessage: string | null;
  hasChanges: boolean;
}

export interface ProfileHeaderProps {
  profile: ProfileData;
  isEditing: boolean;
  onEdit: () => void;
}

export interface ProfileFormProps {
  profile: ProfileData;
  formData: ProfileFormData;

  isEditing: boolean;
  saving: boolean;
  hasChanges: boolean;

  saveError: string | null;
  validationError: string | null;
  successMessage: string | null;

  phoneHasError: boolean;
  phoneHasSuccess: boolean;
  phoneHelperText: string;

  onChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;

  onPhoneBlur: (
    event: FocusEvent<HTMLInputElement>
  ) => void;

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;

  onCancel: () => void;
}

export interface ProfileStatusCardProps {
  status: UserStatus;
}

export interface ProfileSecurityCardProps {
  email: string;
  onOpenPasswordModal: () => void;
}

export const EMPTY_PROFILE_FORM: ProfileFormData = {
  firstName: "",
  lastName: "",
  phone: "",
};