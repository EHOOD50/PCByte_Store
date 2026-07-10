import { SearchX } from "lucide-react";

export default function EmptyCatalog() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/5 py-24 text-center">

      <div className="mb-6 rounded-full bg-[#0066FF]/10 p-6">
        <SearchX
          size={48}
          className="text-[#0066FF]"
        />
      </div>

      <h2 className="text-2xl font-black uppercase tracking-wide text-white">
        No encontramos productos
      </h2>

      <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
        Intenta cambiar la búsqueda o selecciona otra categoría para ver
        más resultados.
      </p>
    </div>
  );
}