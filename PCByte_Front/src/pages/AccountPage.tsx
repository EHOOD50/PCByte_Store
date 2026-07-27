import {
  useMemo,
  useState,
} from "react";

import {
  ChevronRight,
  Home,
  LogOut,
  MapPin,
  Package,
  Settings,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../hooks/useAuth";

type AccountSection =
  | "summary"
  | "orders"
  | "addresses"
  | "profile";

interface AccountMenuItem {
  id: AccountSection;
  label: string;
  description: string;
  icon: typeof UserRound;
}

const ACCOUNT_MENU: AccountMenuItem[] = [
  {
    id: "summary",
    label: "Resumen",
    description: "Vista general de tu cuenta",
    icon: Home,
  },
  {
    id: "orders",
    label: "Mis pedidos",
    description: "Compras y seguimiento",
    icon: Package,
  },
  {
    id: "addresses",
    label: "Mis direcciones",
    description: "Direcciones de entrega",
    icon: MapPin,
  },
  {
    id: "profile",
    label: "Mis datos",
    description: "Información personal",
    icon: Settings,
  },
];

const CHECKOUT_SESSION_KEY =
  "pcbyte_checkout_session_v1";

const PENDING_ORDER_KEY =
  "pcbyte_pending_order_v1";

const AccountPage = () => {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    activeSection,
    setActiveSection,
  ] = useState<AccountSection>(
    "summary"
  );

  const fullName =
    useMemo(() => {
      const name = [
        user?.firstName,
        user?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      return (
        name ||
        user?.email ||
        "Cliente PCByte"
      );
    }, [
      user,
    ]);

  const initials =
    useMemo(() => {
      const parts =
        fullName
          .split(/\s+/)
          .filter(Boolean);

      if (parts.length === 0) {
        return "PC";
      }

      if (parts.length === 1) {
        return parts[0]
          .slice(0, 2)
          .toUpperCase();
      }

      return (
        parts[0][0] +
        parts[parts.length - 1][0]
      ).toUpperCase();
    }, [
      fullName,
    ]);

  const handleLogout = () => {
    logout();

    sessionStorage.removeItem(
      CHECKOUT_SESSION_KEY
    );

    localStorage.removeItem(
      PENDING_ORDER_KEY
    );

    navigate(
      "/productos",
      {
        replace: true,
      }
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return (
          <EmptySection
            icon={
              <Package size={28} />
            }
            eyebrow="Historial de compras"
            title="Mis pedidos"
            description="Aquí podrás revisar tus compras, consultar sus estados y acceder al seguimiento de cada pedido."
          />
        );

      case "addresses":
        return (
          <EmptySection
            icon={
              <MapPin size={28} />
            }
            eyebrow="Datos de entrega"
            title="Mis direcciones"
            description="Aquí podrás agregar, editar y seleccionar tus direcciones de entrega."
          />
        );

      case "profile":
        return (
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
              Información personal
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
              Mis datos
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <InformationCard
                label="Nombre"
                value={
                  user?.firstName ||
                  "No informado"
                }
              />

              <InformationCard
                label="Apellido"
                value={
                  user?.lastName ||
                  "No informado"
                }
              />

              <InformationCard
                label="Correo electrónico"
                value={
                  user?.email ||
                  "No informado"
                }
              />

              <InformationCard
                label="Teléfono"
                value={
                  user?.phone ||
                  "No informado"
                }
              />
            </div>

            <div className="mt-7 rounded-2xl border border-[#0066FF]/15 bg-[#0066FF]/5 p-4">
              <p className="text-xs leading-5 text-slate-600">
                La edición de los datos personales se habilitará en la siguiente etapa del Área del Cliente.
              </p>
            </div>
          </section>
        );

      case "summary":
      default:
        return (
          <div className="space-y-5">
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-[#08101d] via-[#0b1930] to-[#123153] p-6 text-white sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#97cf00]">
                  Mi cuenta PCByte
                </p>

                <h1 className="mt-3 text-3xl font-black tracking-tight">
                  Hola, {user?.firstName || "cliente"}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                  Desde aquí podrás administrar tus pedidos, direcciones e información personal.
                </p>
              </div>

              <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
                <SummaryCard
                  icon={
                    <Package size={20} />
                  }
                  label="Mis pedidos"
                  description="Revisa tus compras"
                  onClick={() =>
                    setActiveSection(
                      "orders"
                    )
                  }
                />

                <SummaryCard
                  icon={
                    <MapPin size={20} />
                  }
                  label="Direcciones"
                  description="Gestiona tus entregas"
                  onClick={() =>
                    setActiveSection(
                      "addresses"
                    )
                  }
                />

                <SummaryCard
                  icon={
                    <UserRound size={20} />
                  }
                  label="Mis datos"
                  description="Consulta tu perfil"
                  onClick={() =>
                    setActiveSection(
                      "profile"
                    )
                  }
                />
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
                Cuenta registrada
              </p>

              <h2 className="mt-2 text-xl font-black text-slate-900">
                Información de la cuenta
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InformationCard
                  label="Cliente"
                  value={fullName}
                />

                <InformationCard
                  label="Correo electrónico"
                  value={
                    user?.email ||
                    "No informado"
                  }
                />

                <InformationCard
                  label="Teléfono"
                  value={
                    user?.phone ||
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
    }
  };

  return (
    <main className="min-h-screen w-full bg-slate-100 text-slate-900">
      <div className="mx-auto grid w-full max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[290px_minmax(0,1fr)] lg:px-8">
        <aside className="h-fit overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">
          <div className="border-b border-slate-200 bg-[#08101d] p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#97cf00] text-base font-black text-[#08101d]">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black">
                  {fullName}
                </p>

                <p className="mt-1 truncate text-xs text-slate-400">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 p-4">
            {ACCOUNT_MENU.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  activeSection ===
                  item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        item.id
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                      active
                        ? "bg-[#0066FF] text-white shadow-md"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-white/15 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black">
                        {item.label}
                      </p>

                      <p
                        className={`mt-0.5 truncate text-[10px] ${
                          active
                            ? "text-blue-100"
                            : "text-slate-400"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    <ChevronRight
                      size={15}
                      className={
                        active
                          ? "text-white"
                          : "text-slate-300"
                      }
                    />
                  </button>
                );
              }
            )}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/productos"
                )
              }
              className="mt-2 w-full rounded-xl px-4 py-3 text-xs font-black text-slate-500 transition hover:bg-slate-100 hover:text-[#0066FF]"
            >
              Volver al catálogo
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          {renderContent()}
        </section>
      </div>
    </main>
  );
};

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}

const SummaryCard = ({
  icon,
  label,
  description,
  onClick,
}: SummaryCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#0066FF]/30 hover:bg-white hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066FF]/10 text-[#0066FF]">
        {icon}
      </div>

      <p className="mt-4 text-sm font-black text-slate-900">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </button>
  );
};

interface InformationCardProps {
  label: string;
  value: string;
  highlighted?: boolean;
}

const InformationCard = ({
  label,
  value,
  highlighted = false,
}: InformationCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p
        className={`mt-2 break-words text-sm font-black ${
          highlighted
            ? "text-[#5f8200]"
            : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

interface EmptySectionProps {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}

const EmptySection = ({
  icon,
  eyebrow,
  title,
  description,
}: EmptySectionProps) => {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
        {icon}
      </div>

      <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-500">
        {description}
      </p>

      <span className="mt-6 inline-flex rounded-full bg-[#97cf00]/15 px-4 py-2 text-[9px] font-black uppercase tracking-wider text-[#5f8200]">
        Próxima implementación
      </span>
    </section>
  );
};

export default AccountPage;