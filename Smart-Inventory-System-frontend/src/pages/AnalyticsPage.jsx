import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import {
  getInventoryValue,
  getMonthlySales,
  getOverview,
  getRevenue,
  getTopProducts,
} from "../services/analyticsService";
import { getApiErrorMessage } from "../services/apiClient";

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ kind: "", message: "" });
  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [inventoryValue, setInventoryValue] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const [
          overviewResponse,
          topProductsResponse,
          monthlySalesResponse,
          revenueResponse,
          inventoryValueResponse,
        ] = await Promise.all([
          getOverview(),
          getTopProducts(),
          getMonthlySales(),
          getRevenue(),
          getInventoryValue(),
        ]);

        if (!active) return;

        setOverview(overviewResponse.data);
        setTopProducts(topProductsResponse.data || []);
        setMonthlySales(monthlySalesResponse.data || []);
        setRevenue(revenueResponse.data?.totalRevenue || 0);
        setInventoryValue(inventoryValueResponse.data?.totalInventoryValue || 0);
      } catch (err) {
        if (active) {
          setStatus({ kind: "error", message: getApiErrorMessage(err) });
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
  }, []);

  if (loading) {
    return <LoadingState label="Loading analytics..." />;
  }

  return (
    <section>
      <PageHeader title="Analytics" subtitle="All analytics endpoints are shown on this page." />
      <StatusBanner kind={status.kind} message={status.message} />

      <div className="cards-grid">
        <article className="data-card">
          <h3>Products</h3>
          <p>{overview?.totalProducts ?? 0}</p>
        </article>
        <article className="data-card">
          <h3>Inventory Records</h3>
          <p>{overview?.totalInventoryItems ?? 0}</p>
        </article>
        <article className="data-card">
          <h3>Bills</h3>
          <p>{overview?.totalBills ?? 0}</p>
        </article>
        <article className="data-card">
          <h3>Revenue</h3>
          <p>{revenue}</p>
        </article>
        <article className="data-card">
          <h3>Inventory Value</h3>
          <p>{inventoryValue}</p>
        </article>
      </div>

      <div className="cards-grid two-col">
        <div className="panel">
          <h3>Top Products</h3>
          <ul className="detail-list">
            {topProducts.map((item) => (
              <li key={item.productId}>
                {item.name}: Sold {item.totalSold}
              </li>
            ))}
          </ul>
        </div>

        <div className="panel">
          <h3>Monthly Sales</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.map((item, index) => (
                  <tr key={index}>
                    <td>{item._id?.year}</td>
                    <td>{item._id?.month}</td>
                    <td>{item.totalSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsPage;
