import {
  Check,
  ClipboardCheck,
  CreditCard,
  MapPin,
  PackageCheck,
  Truck,
  UserRound,
} from "lucide-react";

export type CheckoutStep =
  | "information"
  | "address"
  | "shipping"
  | "payment"
  | "review"
  | "confirmation";

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const steps: Array<{
  id: CheckoutStep;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: "information",
    label: "Datos",
    icon: <UserRound size={16} />,
  },
  {
    id: "address",
    label: "Dirección",
    icon: <MapPin size={16} />,
  },
  {
    id: "shipping",
    label: "Despacho",
    icon: <Truck size={16} />,
  },
  {
    id: "payment",
    label: "Pago",
    icon: <CreditCard size={16} />,
  },
  {
    id: "review",
    label: "Revisión",
    icon: <ClipboardCheck size={16} />,
  },
  {
    id: "confirmation",
    label: "Confirmación",
    icon: <PackageCheck size={16} />,
  },
];

export const CheckoutSteps = ({
  currentStep,
}: CheckoutStepsProps) => {
  const currentIndex = steps.findIndex(
    (step) => step.id === currentStep
  );

  return (
    <div className="border-b border-slate-100 bg-white px-5 py-4 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-6 gap-2">
        {steps.map((step, index) => {
          const completed =
            index < currentIndex;

          const active =
            step.id === currentStep;

          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center text-center"
            >
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-1/2 top-5 h-px w-full ${
                    index < currentIndex
                      ? "bg-[#97cf00]"
                      : "bg-slate-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border transition ${
                  completed
                    ? "border-[#97cf00] bg-[#97cf00] text-slate-900"
                    : active
                      ? "border-[#0066FF] bg-[#0066FF] text-white shadow-[0_8px_20px_rgba(0,102,255,0.25)]"
                      : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {completed
                  ? <Check size={17} />
                  : step.icon}
              </div>

              <span
                className={`mt-2 text-[9px] font-black uppercase tracking-wider ${
                  active
                    ? "text-[#0066FF]"
                    : completed
                      ? "text-[#6f9900]"
                      : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps;