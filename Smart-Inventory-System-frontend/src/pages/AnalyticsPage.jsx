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

  const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(Number(value) || 0);

  const getMonthLabel = (monthNumber) => {
    if (!monthNumber) return "-";
    return new Date(2000, monthNumber - 1, 1).toLocaleString("en-US", { month: "short" });
  };

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
          <h3>Total Products</h3>
          <p>{formatNumber(overview?.totalProducts)}</p>
        </article>
        <article className="data-card">
          <h3>Total Inventory Items</h3>
          <p>{formatNumber(overview?.totalInventoryItems)}</p>
        </article>
        <article className="data-card">
          <h3>Total Bills</h3>
          <p>{formatNumber(overview?.totalBills)}</p>
        </article>
        {/* <article className="data-card">
          <h3>Overview Revenue</h3>
          <p>{formatNumber(overview?.totalRevenue)}</p>
        </article> */}
        <article className="data-card">
          <h3>Total Revenue</h3>
          <p>{formatNumber(revenue)}</p>
        </article>
        <article className="data-card">
          <h3>Total Inventory Value</h3>
          <p>{formatNumber(inventoryValue)}</p>
        </article>
      </div>

      <div className="cards-grid two-col">
        <div className="panel">
          <h3>Top Products (By Quantity Sold)</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Total Sold</th>
                  <th>Product ID</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length ? (
                  topProducts.map((item, index) => (
                    <tr key={item.productId || index}>
                      <td>{index + 1}</td>
                      <td>{item.name || "-"}</td>
                      <td>{formatNumber(item.totalSold)}</td>
                      <td>{item.productId || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No top-products data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>Monthly Sales (Amount)</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {monthlySales.length ? (
                  monthlySales.map((item, index) => (
                    <tr key={`${item._id?.year}-${item._id?.month}-${index}`}>
                      <td>{item._id?.year || "-"}</td>
                      <td>{getMonthLabel(item._id?.month)}</td>
                      <td>{formatNumber(item.totalSales)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No monthly-sales data found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyticsPage;