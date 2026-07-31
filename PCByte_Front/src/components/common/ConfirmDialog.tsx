import {
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;

  title: string;

  message: string;

  confirmText?: string;

  cancelText?: string;

  isProcessing?: boolean;

  variant?: "danger" | "primary";

  onConfirm: () => void;

  onCancel: () => void;
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Volver",
  isProcessing = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!isOpen) {
    return null;
  }

  const confirmButtonClasses =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-[#0066FF] text-white hover:bg-[#0052cc]";

  const iconClasses =
    variant === "danger"
      ? "bg-red-50 text-red-600"
      : "bg-[#0066FF]/10 text-[#0066FF]";

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Cerrar confirmación"
        onClick={onCancel}
        disabled={isProcessing}
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[3px]"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.30)]"
      >
        <header className="flex items-start justify-between gap-5 border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClasses}`}
            >
              <AlertTriangle
                size={22}
              />
            </div>

            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                Confirmar acción
              </p>

              <h2
                id="confirm-dialog-title"
                className="mt-1 text-xl font-black tracking-tight text-slate-900"
              >
                {title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            aria-label="Cerrar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
          </button>
        </header>

        <div className="px-6 py-6">
          <p
            id="confirm-dialog-message"
            className="text-sm font-medium leading-6 text-slate-600"
          >
            {message}
          </p>

          {variant === "danger" && (
            <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-bold leading-5 text-red-600">
              Esta acción no se puede deshacer.
            </p>
          )}
        </div>

        <footer className="grid gap-3 border-t border-slate-200 bg-slate-50 px-6 py-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-[10px] font-black uppercase tracking-wider text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-[10px] font-black uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-60 ${confirmButtonClasses}`}
          >
            {isProcessing && (
              <Loader2
                size={16}
                className="animate-spin"
              />
            )}

            {isProcessing
              ? "Procesando..."
              : confirmText}
          </button>
        </footer>
      </section>
    </div>
  );
};

export default ConfirmDialog;