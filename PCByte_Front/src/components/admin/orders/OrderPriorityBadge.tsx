import type {
  LucideIcon,
} from "lucide-react";

import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Minus,
  PackageOpen,
  Truck,
} from "lucide-react";

import {
  getOrderPriority,
} from "../../../utils/orderPriority";

interface OrderPriorityBadgeProps {
  status?: string | null;
  paidAt?: string | null;
  preparingAt?: string | null;
  shippedAt?: string | null;
}

const getPriorityIcon = (
  priority: string
): LucideIcon => {
  switch (priority) {
    case "URGENT":
    case "HIGH":
      return AlertTriangle;

    case "WAITING_PAYMENT":
      return CircleDollarSign;

    case "IN_TRANSIT":
      return Truck;

    case "FINISHED":
      return CheckCircle2;

    case "NO_MANAGEMENT":
      return Minus;

    case "NORMAL":
    default:
      return PackageOpen;
  }
};

const OrderPriorityBadge = ({
  status,
  paidAt,
  preparingAt,
  shippedAt,
}: OrderPriorityBadgeProps) => {
  const priority =
    getOrderPriority(
      status,
      paidAt,
      preparingAt,
      shippedAt
    );

  const PriorityIcon =
    getPriorityIcon(
      priority.priority
    );

  return (
    <div className="min-w-[145px]">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-wider ${priority.classes}`}
      >
        <PriorityIcon
          size={12}
          className="shrink-0"
        />

        {priority.label}
      </span>

      {priority.elapsedLabel && (
        <p className="mt-1.5 text-[9px] font-black text-slate-600">
          {priority.elapsedLabel}
        </p>
      )}

      {priority.description && (
        <p className="mt-0.5 max-w-[165px] text-[8px] font-bold leading-3 text-slate-400">
          {priority.description}
        </p>
      )}
    </div>
  );
};

export default OrderPriorityBadge;