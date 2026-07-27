interface SummaryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

const SummaryCard = ({
  icon,
  title,
  description,
  onClick,
}: SummaryCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#0066FF]/30 hover:bg-white hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF] transition group-hover:bg-[#0066FF] group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </button>
  );
};

export default SummaryCard;