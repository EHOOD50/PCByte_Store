import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../../hooks/useAuth";

import AccountLayout from "../layout/AccountLayout";
import AddressesPage from "../pages/AddressesPage";
import OrdersPage from "../pages/OrdersPage";
import ProfilePage from "../pages/ProfilePage";
import SummaryPage from "../pages/SummaryPage";

const AccountRoutes = () => {
  const location = useLocation();

  const {
    isAuthenticated,
  } = useAuth();

  /*
   * Protege todo el Módulo Cliente.
   *
   * Si no existe una sesión válida,
   * se envía al usuario al login.
   */
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return (
    <Routes>
      <Route
        element={<AccountLayout />}
      >
        <Route
          index
          element={
            <Navigate
              to="summary"
              replace
            />
          }
        />

        <Route
          path="summary"
          element={<SummaryPage />}
        />

        <Route
          path="orders"
          element={<OrdersPage />}
        />

        <Route
          path="addresses"
          element={<AddressesPage />}
        />

        <Route
          path="profile"
          element={<ProfilePage />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="summary"
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default AccountRoutes;