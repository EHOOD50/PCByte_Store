import { useNavigate } from "react-router-dom";

import AdminLogin from "../components/AdminLogin";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  return (
    <AdminLogin
      onClose={() => navigate("/productos")}
      onLoginSuccess={() => navigate("/admin")}
    />
  );
}