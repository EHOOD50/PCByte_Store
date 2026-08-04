import type {
  KeyboardEvent,
  ReactNode,
} from "react";

interface DashboardCardProps {
  title: string;
  value: string;
  description?: string;
  icon: ReactNode;
  badge?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  onClick?: () => void;
}

const DashboardCard = ({
  title,
  value,
  description,
  icon,
  badge,
  trend,
  onClick,
}: DashboardCardProps) => {
  const interactive =
    typeof onClick === "function";

  const handleKeyDown = (
    event: KeyboardEvent<HTMLElement>
  ) => {
    if (!interactive) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={
        interactive
          ? "button"
          : undefined
      }
      tabIndex={
        interactive
          ? 0
          : undefined
      }
      className={`group relative h-full min-h-[132px] overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition ${
        interactive
          ? "cursor-pointer outline-none hover:-translate-y-0.5 hover:border-[#0066FF]/25 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2"
          : ""
      }`}
    >
      <div className="absolute -right-7 -top-7 h-16 w-16 rounded-full bg-[#0066FF]/5 transition-transform group-hover:scale-110" />

      <div className="relative flex h-full items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-h-6 items-start justify-between gap-3">
            <p className="pt-0.5 text-[9px] font-black uppercase tracking-[0.17em] text-slate-400">
              {title}
            </p>

            {badge && (
              <span className="shrink-0 rounded-full bg-[#97cf00]/15 px-2.5 py-1 text-[8px] font-black uppercase tracking-wider text-[#5f8200]">
                {badge}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <p className="min-w-0 break-words text-[1.6rem] font-black leading-tight tracking-tight text-slate-900">
              {value}
            </p>

            {trend && (
              <span
                className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-wider ${
                  trend.positive === false
                    ? "bg-red-50 text-red-600"
                    : "bg-[#97cf00]/15 text-[#5f8200]"
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default DashboardCard;