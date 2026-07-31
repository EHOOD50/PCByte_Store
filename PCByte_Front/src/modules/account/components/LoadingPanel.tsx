import {
  Loader2,
} from "lucide-react";

interface LoadingPanelProps {
  title: string;
  description: string;
}

const LoadingPanel = ({
  title,
  description,
}: LoadingPanelProps) => {
  return (
    <section className="flex min-h-72 items-center justify-center rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <Loader2
          size={34}
          className="mx-auto animate-spin text-[#0066FF]"
        />

        <p className="mt-4 text-sm font-black text-slate-800">
          {title}
        </p>

        <p className="mt-2 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </section>
  );
};

export default LoadingPanel;