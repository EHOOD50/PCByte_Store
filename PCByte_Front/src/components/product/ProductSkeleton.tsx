export default function ProductSkeleton() {
  return (
    <article className="h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-sm animate-pulse">
      <div className="m-4 mb-0 aspect-square rounded-[1.35rem] bg-slate-200" />

      <div className="space-y-4 p-5">
        <div className="h-2 w-24 rounded bg-slate-200" />

        <div className="space-y-2">
          <div className="h-4 rounded bg-slate-200" />
          <div className="h-4 w-3/4 rounded bg-slate-200" />
        </div>

        <div className="h-8 w-32 rounded bg-slate-200" />

        <div className="h-12 rounded-2xl bg-slate-200" />
      </div>
    </article>
  );
}