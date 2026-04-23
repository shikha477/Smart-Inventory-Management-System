import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AlertsPage from "./pages/AlertsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BillingPage from "./pages/BillingPage";
import DashboardPage from "./pages/DashboardPage";
import ForecastPage from "./pages/ForecastPage";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductsPage from "./pages/ProductsPage";
import RegisterPage from "./pages/RegisterPage";
import SuppliersPage from "./pages/SuppliersPage";
import UsersPage from "./pages/UsersPage";
import ReportPage from "./pages/ReportPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route
          path="alerts"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <AlertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="forecast"
          element={
            <ProtectedRoute allowedRoles={["admin", "manager"]}>
              <ForecastPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reports"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ReportPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
