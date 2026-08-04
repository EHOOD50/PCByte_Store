interface UserStatusBadgeProps {
  label: string;
  color:
    | "green"
    | "yellow"
    | "red"
    | "blue"
    | "gray";
}

const styles = {
  green:
    "bg-emerald-100 text-emerald-700",

  yellow:
    "bg-amber-100 text-amber-700",

  red:
    "bg-red-100 text-red-700",

  blue:
    "bg-sky-100 text-sky-700",

  gray:
    "bg-slate-100 text-slate-700",
};

export default function UserStatusBadge({
  label,
  color,
}: UserStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${styles[color]}`}
    >
      {label}
    </span>
  );
}