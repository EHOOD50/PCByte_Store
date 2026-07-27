interface InformationCardProps {
  label: string;
  value: React.ReactNode;
  highlighted?: boolean;
}

const InformationCard = ({
  label,
  value,
  highlighted = false,
}: InformationCardProps) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-[#0066FF]/25 hover:bg-white hover:shadow-sm">

      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <div
        className={`mt-2 break-words text-sm font-bold ${
          highlighted
            ? "text-[#5f8200]"
            : "text-slate-800"
        }`}
      >
        {value}
      </div>

    </article>
  );
};

export default InformationCard;