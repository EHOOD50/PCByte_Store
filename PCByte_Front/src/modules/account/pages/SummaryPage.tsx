import {
  MapPin,
  Package,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

import InformationCard from "../components/InformationCard";
import SummaryCard from "../components/SummaryCard";

const SummaryPage = () => {
  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const fullName =
    [
      user?.firstName,
      user?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    "Cliente PCByte";

  return (
    <div className="space-y-6">

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

        <div className="bg-gradient-to-br from-[#08101d] via-[#0b1930] to-[#123153] p-8 text-white">

          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#97cf00]">

            Mi cuenta PCByte

          </p>

          <h1 className="mt-3 text-3xl font-black">

            Hola, {user?.firstName || "Cliente"}

          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">

            Bienvenido nuevamente.
            Desde aquí podrás revisar tus pedidos,
            administrar tus direcciones y mantener
            actualizada tu información personal.

          </p>

        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3">

          <SummaryCard
            icon={<Package size={20} />}
            title="Mis pedidos"
            description="Consulta el historial y seguimiento de tus compras."
            onClick={() =>
              navigate("/account/orders")
            }
          />

          <SummaryCard
            icon={<MapPin size={20} />}
            title="Mis direcciones"
            description="Gestiona tus direcciones de despacho."
            onClick={() =>
              navigate("/account/addresses")
            }
          />

          <SummaryCard
            icon={<UserRound size={20} />}
            title="Mis datos"
            description="Consulta y actualiza tu información personal."
            onClick={() =>
              navigate("/account/profile")
            }
          />

        </div>

      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">

          Información de la cuenta

        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-900">

          Datos registrados

        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <InformationCard
            label="Cliente"
            value={fullName}
          />

          <InformationCard
            label="Correo electrónico"
            value={
              user?.email ??
              "No informado"
            }
          />

          <InformationCard
            label="Teléfono"
            value={
              user?.phone ??
              "No informado"
            }
          />

          <InformationCard
            label="Estado"
            value="Cuenta activa"
            highlighted
          />

        </div>

      </section>

    </div>
  );
};

export default SummaryPage;