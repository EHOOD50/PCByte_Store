import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { RegisterForm } from "../components/RegisterForm";

interface RegisterLocationState {
  from?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as RegisterLocationState | null;

  const destination =
    state?.from &&
    state.from !== "/register"
      ? state.from
      : "/productos";

  const handleRegisterSuccess = () => {
    navigate("/login", {
      replace: true,
      state: {
        from: destination,
      },
    });
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-[#f8fbff] to-[#f7fbef] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1700px] items-center px-5 py-3 sm:px-8 lg:px-12">
        <RegisterForm
          onRegisterSuccess={
            handleRegisterSuccess
          }
          onBack={() =>
            navigate("/productos")
          }
          onLogin={() =>
            navigate("/login", {
              state: {
                from: destination,
              },
            })
          }
        />
      </div>
    </main>
  );
};

export default RegisterPage;