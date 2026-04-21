import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { useAuth } from "../hooks/useAuth";
import { getOverview } from "../services/analyticsService";
import { getApiErrorMessage } from "../services/apiClient";
import { getInventorySummary } from "../services/inventoryService";

function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [inventorySummary, setInventorySummary] = useState(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const inventoryResponse = await getInventorySummary();
        if (active) {
          setInventorySummary(inventoryResponse.data);
        }

        if (["admin", "manager"].includes(user?.role)) {
          const analyticsResponse = await getOverview();
          if (active) {
            setAnalytics(analyticsResponse.data);
          }
        }
      } catch (err) {
        if (active) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [user?.role]);

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  return (
    <section>
      <PageHeader
        title="Dashboard"
        subtitle="High level summary from analytics and inventory controllers."
      />

      <StatusBanner kind="error" message={error} />

      <div className="cards-grid">
        <article className="data-card">
          <h3>Total Products</h3>
          <p>{inventorySummary?.totalProducts ?? 0}</p>
        </article>
        <article className="data-card">
          <h3>Total Stock</h3>
          <p>{inventorySummary?.totalStock ?? 0}</p>
        </article>
        <article className="data-card">
          <h3>Total Transactions</h3>
          <p>{inventorySummary?.totalTransactions ?? 0}</p>
        </article>

        {["admin", "manager"].includes(user?.role) ? (
          <>
            <article className="data-card">
              <h3>Total Bills</h3>
              <p>{analytics?.totalBills ?? 0}</p>
            </article>
            <article className="data-card">
              <h3>Total Revenue</h3>
              <p>{analytics?.totalRevenue ?? 0}</p>
            </article>
            <article className="data-card">
              <h3>Inventory Records</h3>
              <p>{analytics?.totalInventoryItems ?? 0}</p>
            </article>
          </>
        ) : null}
      </div>
    </section>
  );
}

export default DashboardPage;
