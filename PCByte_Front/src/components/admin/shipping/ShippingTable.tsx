import {
  CircleOff,
  Edit3,
  MapPin,
  Power,
  Trash2,
  Truck,
} from "lucide-react";

import type {
  ShippingRate,
} from "../../../types/shipping";

interface ShippingTableProps {
  rates: ShippingRate[];
  onEdit: (
    rate: ShippingRate
  ) => void;
  onDelete: (
    rate: ShippingRate
  ) => void;
  onToggleStatus: (
    rate: ShippingRate
  ) => void;
}

const formatCurrency = (
  value: number | null
) => {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat(
    "es-CL",
    {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }
  ).format(value);
};

const getCoverageLabel = (
  rate: ShippingRate
) => {
  if (rate.city) {
    return `${rate.city}, ${rate.region ?? "Sin región"}`;
  }

  if (rate.region) {
    return `Toda la región: ${rate.region}`;
  }

  return "Cobertura nacional";
};

const getShippingTypeLabel = (
  shippingType: string
) => {
  switch (shippingType) {
    case "HOME_DELIVERY":
      return "Despacho a domicilio";

    case "EXPRESS":
      return "Despacho express";

    case "STORE_PICKUP":
      return "Retiro en tienda";

    default:
      return shippingType
        .replaceAll("_", " ")
        .toLowerCase();
  }
};

const ShippingTable = ({
  rates,
  onEdit,
  onDelete,
  onToggleStatus,
}: ShippingTableProps) => {
  if (rates.length === 0) {
    return (
      <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <CircleOff size={26} />
        </div>

        <h3 className="mt-5 text-lg font-black text-slate-900">
          No hay tarifas registradas
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Crea una tarifa para comenzar a calcular automáticamente el costo de despacho según el destino del cliente.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Estado
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Tarifa
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Cobertura
              </th>

              <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Tipo
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Precio
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Gratis desde
              </th>

              <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Plazo
              </th>

              <th className="px-5 py-4 text-center text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Prioridad
              </th>

              <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rates.map((rate) => (
              <tr
                key={rate.id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      onToggleStatus(rate)
                    }
                    className={`inline-flex min-h-[34px] items-center gap-2 rounded-full px-3 text-[9px] font-black uppercase tracking-wider transition ${
                      rate.active
                        ? "bg-[#97cf00]/15 text-[#5f8200] hover:bg-[#97cf00]/25"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <Power size={13} />

                    {rate.active
                      ? "Activa"
                      : "Inactiva"}
                  </button>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
                      <Truck size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-black text-slate-900">
                        {rate.name}
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {rate.carrier ||
                          "Sin transportista"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex max-w-[260px] items-start gap-2">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-slate-400"
                    />

                    <p className="text-xs font-bold leading-5 text-slate-600">
                      {getCoverageLabel(rate)}
                    </p>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#0066FF]/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-[#0066FF]">
                    {getShippingTypeLabel(
                      rate.shippingType
                    )}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <p className="text-sm font-black text-slate-900">
                    {formatCurrency(
                      rate.price
                    )}
                  </p>
                </td>

                <td className="px-5 py-4 text-right">
                  <p className="text-xs font-bold text-slate-600">
                    {formatCurrency(
                      rate.freeShippingFrom
                    )}
                  </p>
                </td>

                <td className="px-5 py-4 text-center">
                  <p className="text-xs font-black text-slate-700">
                    {rate.estimatedMinDays ===
                    rate.estimatedMaxDays
                      ? `${rate.estimatedMinDays} día(s)`
                      : `${rate.estimatedMinDays}–${rate.estimatedMaxDays} días`}
                  </p>
                </td>

                <td className="px-5 py-4 text-center">
                  <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-black text-slate-600">
                    {rate.priority}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(rate)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-[#0066FF]/30 hover:bg-[#0066FF]/5 hover:text-[#0066FF]"
                      aria-label={`Editar ${rate.name}`}
                    >
                      <Edit3 size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(rate)
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Eliminar ${rate.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ShippingTable;