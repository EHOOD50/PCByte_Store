import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { LoginForm } from "../components/LoginForm";

interface LoginLocationState {
  from?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as LoginLocationState | null;

  const destination =
    state?.from &&
    state.from !== "/login"
      ? state.from
      : "/productos";

  const handleLoginSuccess = () => {
    navigate(destination, {
      replace: true,
    });
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-[#f8fbff] to-[#f7fbef] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-5 py-4 sm:px-8 lg:px-12">
        <LoginForm
          onLoginSuccess={
            handleLoginSuccess
          }
          onBack={() =>
            navigate("/productos")
          }
          onRegister={() =>
            navigate("/register", {
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

export default LoginPage;