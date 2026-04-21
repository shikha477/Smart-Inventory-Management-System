import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { getApiErrorMessage } from "../services/apiClient";
import {
  addStock,
  getInventoryHistory,
  removeStock,
} from "../services/inventoryService";
import { getProducts } from "../services/productService";

function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ kind: "", message: "" });

  const [addForm, setAddForm] = useState({ productId: "", quantity: 1, note: "" });
  const [removeForm, setRemoveForm] = useState({ productId: "", quantity: 1, note: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsResponse, historyResponse] = await Promise.all([
        getProducts(),
        getInventoryHistory(),
      ]);
      setProducts(productsResponse.data || []);
      setHistory(historyResponse.data || []);
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddStock = async (event) => {
    event.preventDefault();
    try {
      const response = await addStock({
        productId: addForm.productId,
        quantity: Number(addForm.quantity),
        note: addForm.note,
      });
      setStatus({ kind: "success", message: response.message || "Stock added" });
      setAddForm({ productId: "", quantity: 1, note: "" });
      await loadData();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  const handleRemoveStock = async (event) => {
    event.preventDefault();
    try {
      const response = await removeStock({
        productId: removeForm.productId,
        quantity: Number(removeForm.quantity),
        note: removeForm.note,
      });
      setStatus({ kind: "success", message: response.message || "Stock removed" });
      setRemoveForm({ productId: "", quantity: 1, note: "" });
      await loadData();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  if (loading) {
    return <LoadingState label="Loading inventory..." />;
  }

  return (
    <section>
      <PageHeader
        title="Inventory"
        subtitle="Stock operations and movement history from inventory controller."
      />
      <StatusBanner kind={status.kind} message={status.message} />

      <div className="cards-grid two-col">
        <form className="panel" onSubmit={handleAddStock}>
          <h3>Add Stock</h3>
          <select
            value={addForm.productId}
            onChange={(e) => setAddForm({ ...addForm, productId: e.target.value })}
            required
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={addForm.quantity}
            onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })}
            required
          />
          <textarea
            placeholder="Note"
            value={addForm.note}
            onChange={(e) => setAddForm({ ...addForm, note: e.target.value })}
          />
          <button className="btn btn-primary" type="submit">
            Add Stock
          </button>
        </form>

        <form className="panel" onSubmit={handleRemoveStock}>
          <h3>Remove Stock</h3>
          <select
            value={removeForm.productId}
            onChange={(e) => setRemoveForm({ ...removeForm, productId: e.target.value })}
            required
          >
            <option value="">Select product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            value={removeForm.quantity}
            onChange={(e) => setRemoveForm({ ...removeForm, quantity: e.target.value })}
            required
          />
          <textarea
            placeholder="Note"
            value={removeForm.note}
            onChange={(e) => setRemoveForm({ ...removeForm, note: e.target.value })}
          />
          <button className="btn btn-warning" type="submit">
            Remove Stock
          </button>
        </form>
      </div>

      <div className="panel">
        <h3>Inventory History</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Previous</th>
                <th>New</th>
                <th>By</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id}>
                  <td>{item.product?.name || "-"}</td>
                  <td>{item.type}</td>
                  <td>{item.quantity}</td>
                  <td>{item.previousStock}</td>
                  <td>{item.newStock}</td>
                  <td>{item.createdBy?.name || "-"}</td>
                  <td>{item.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default InventoryPage;
