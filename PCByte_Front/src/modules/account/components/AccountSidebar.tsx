import {
  Home,
  LogOut,
  MapPin,
  Package,
  Settings,
  UserRound,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

const CHECKOUT_SESSION_KEY =
  "pcbyte_checkout_session_v1";

const PENDING_ORDER_KEY =
  "pcbyte_pending_order_v1";

const MENU_ITEMS = [
  {
    to: "/account/summary",
    icon: Home,
    title: "Resumen",
    description:
      "Vista general",
  },
  {
    to: "/account/orders",
    icon: Package,
    title: "Mis pedidos",
    description:
      "Compras y seguimiento",
  },
  {
    to: "/account/addresses",
    icon: MapPin,
    title: "Mis direcciones",
    description:
      "Direcciones de entrega",
  },
  {
    to: "/account/profile",
    icon: Settings,
    title: "Mis datos",
    description:
      "Información personal",
  },
];

const AccountSidebar = () => {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const fullName =
    [
      user?.firstName,
      user?.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    user?.email ||
    "Cliente";

  const initials =
    fullName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

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

  return (
    <aside className="h-fit overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6">

      <div className="border-b border-slate-200 bg-[#08101d] p-6 text-white">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#97cf00] text-base font-black text-[#08101d]">

            {initials}

          </div>

          <div>

            <p className="text-sm font-black">

              {fullName}

            </p>

            <p className="mt-1 text-xs text-slate-400">

              Cliente registrado

            </p>

          </div>

        </div>

      </div>

      <nav className="space-y-2 p-4">

        {MENU_ITEMS.map(
          (item) => {
            const Icon =
              item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                    isActive
                      ? "bg-[#0066FF] text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                {({
                  isActive,
                }) => (
                  <>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isActive
                          ? "bg-white/15"
                          : "bg-slate-100"
                      }`}
                    >

                      <Icon
                        size={18}
                      />

                    </div>

                    <div>

                      <p className="text-xs font-black">

                        {item.title}

                      </p>

                      <p
                        className={`text-[10px] ${
                          isActive
                            ? "text-blue-100"
                            : "text-slate-400"
                        }`}
                      >

                        {item.description}

                      </p>

                    </div>

                  </>
                )}
              </NavLink>
            );
          }
        )}

      </nav>

      <div className="border-t border-slate-200 p-4">

        <button
          onClick={
            handleLogout
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-600 hover:text-white"
        >

          <LogOut size={16} />

          Cerrar sesión

        </button>

        <button
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
  );
};

export default AccountSidebar;