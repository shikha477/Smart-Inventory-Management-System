import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { getApiErrorMessage } from "../services/apiClient";
import { getAllForecast, getProductForecast } from "../services/forecastService";
import { getProducts } from "../services/productService";

function ForecastPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ kind: "", message: "" });
  const [forecasts, setForecasts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productForecast, setProductForecast] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [allForecastResponse, productResponse] = await Promise.all([
        getAllForecast(),
        getProducts(),
      ]);
      setForecasts(allForecastResponse.forecasts || []);
      setProducts(productResponse.data || []);
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const fetchProductForecast = async () => {
    if (!selectedProduct) return;
    try {
      const response = await getProductForecast(selectedProduct);
      setProductForecast(response);
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  if (loading) {
    return <LoadingState label="Loading forecast data..." />;
  }

  return (
    <section>
      <PageHeader title="Forecast" subtitle="Demand prediction from forecast controller endpoints." />
      <StatusBanner kind={status.kind} message={status.message} />

      <div className="panel">
        <h3>Product Forecast</h3>
        <div className="actions-row">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={fetchProductForecast}>
            Get Forecast
          </button>
        </div>

        {productForecast ? (
          <div className="cards-grid compact-grid">
            <article className="data-card">
              <h4>Product</h4>
              <p>{productForecast.product}</p>
            </article>
            <article className="data-card">
              <h4>Avg Daily Sales</h4>
              <p>{productForecast.avgDailySales}</p>
            </article>
            <article className="data-card">
              <h4>Trend</h4>
              <p>{productForecast.trend}</p>
            </article>
            <article className="data-card">
              <h4>Next Week</h4>
              <p>{productForecast.predictedNextWeek}</p>
            </article>
            <article className="data-card">
              <h4>Suggested Stock</h4>
              <p>{productForecast.suggestedStock}</p>
            </article>
          </div>
        ) : null}
      </div>

      <div className="panel">
        <h3>All Product Forecasts</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Avg Daily Sales</th>
                <th>Trend</th>
                <th>Next Week</th>
                <th>Suggested Stock</th>
              </tr>
            </thead>
            <tbody>
              {forecasts.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.avgDailySales}</td>
                  <td>{item.trend}</td>
                  <td>{item.predictedNextWeek}</td>
                  <td>{item.suggestedStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ForecastPage;
