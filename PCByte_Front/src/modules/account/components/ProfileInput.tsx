 import type {
  ChangeEvent,
  FocusEvent,
  ReactNode,
} from "react";

interface ProfileInputProps {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  icon: ReactNode;
  maxLength: number;
  disabled: boolean;
  type?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  required?: boolean;
  optional?: boolean;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  onBlur?: (
    event: FocusEvent<HTMLInputElement>
  ) => void;
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
  type = "text",
  inputMode,
  autoComplete,
  required = false,
  optional = false,
  error = false,
  success = false,
  helperText,
  onBlur,
  onChange,
}: ProfileInputProps) => {
  const borderClass = error
    ? "border-red-300 focus:border-red-500"
    : success
      ? "border-[#97cf00] focus:border-[#6f9900]"
      : "border-slate-200 focus:border-[#0066FF]";

  const iconClass = error
    ? "text-red-400"
    : success
      ? "text-[#6f9900]"
      : "text-slate-300";

  const helperClass = error
    ? "text-red-500"
    : success
      ? "text-[#6f9900]"
      : "text-slate-400";

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
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconClass}`}
        >
          {icon}
        </div>

        <input
          id={name}
          name={name}
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          onBlur={onBlur}
          onChange={onChange}
          aria-invalid={error}
          aria-describedby={
            helperText
              ? `${name}-helper`
              : undefined
          }
          className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-sm font-bold text-slate-900 outline-none transition placeholder:font-medium placeholder:text-slate-300 focus:bg-white disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${borderClass}`}
        />
      </div>

      {helperText && (
        <p
          id={`${name}-helper`}
          className={`mt-1.5 text-[10px] font-semibold leading-4 ${helperClass}`}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default ProfileInput;