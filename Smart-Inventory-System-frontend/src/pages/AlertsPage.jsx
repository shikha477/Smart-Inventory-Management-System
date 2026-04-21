import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/apiClient";
import {
  deleteAlert,
  getAllAlerts,
  getLowStockAlerts,
  markAlertAsRead,
} from "../services/alertService";

function AlertsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [status, setStatus] = useState({ kind: "", message: "" });

  const isAdmin = user?.role === "admin";

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const response = onlyLowStock ? await getLowStockAlerts() : await getAllAlerts();
      setAlerts(response.data || []);
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [onlyLowStock]);

  const readAlert = async (id) => {
    try {
      const response = await markAlertAsRead(id);
      setStatus({ kind: "success", message: response.message || "Alert marked as read" });
      await loadAlerts();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  const removeAlert = async (id) => {
    if (!window.confirm("Delete this alert?")) return;
    try {
      const response = await deleteAlert(id);
      setStatus({ kind: "success", message: response.message || "Alert deleted" });
      await loadAlerts();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  if (loading) {
    return <LoadingState label="Loading alerts..." />;
  }

  return (
    <section>
      <PageHeader title="Alerts" subtitle="Low stock and system alerts from alert controller." />
      <StatusBanner kind={status.kind} message={status.message} />

      <div className="panel panel-head">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={onlyLowStock}
            onChange={(e) => setOnlyLowStock(e.target.checked)}
          />
          Show low stock alerts only
        </label>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Message</th>
                <th>Product</th>
                <th>Read</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id}>
                  <td>{alert.type}</td>
                  <td>{alert.message}</td>
                  <td>{alert.product?.name || "-"}</td>
                  <td>{alert.isRead ? "Yes" : "No"}</td>
                  <td className="actions-row">
                    {!alert.isRead ? (
                      <button className="btn btn-secondary" onClick={() => readAlert(alert._id)}>
                        Mark Read
                      </button>
                    ) : null}
                    {isAdmin ? (
                      <button className="btn btn-danger" onClick={() => removeAlert(alert._id)}>
                        Delete
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AlertsPage;
