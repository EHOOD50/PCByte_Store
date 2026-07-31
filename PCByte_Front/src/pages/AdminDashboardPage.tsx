import { useNavigate } from "react-router-dom";

import AdminDashboard from "../components/AdminDashboard";

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <AdminDashboard
      onLogout={() => {
        localStorage.removeItem("admin_auth_token");
        navigate("/admin/login");
      }}
    />
  );
}