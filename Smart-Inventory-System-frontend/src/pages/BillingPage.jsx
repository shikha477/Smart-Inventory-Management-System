import { useEffect, useMemo, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/apiClient";
import { createBill, deleteBill, getBillById, getBills } from "../services/billingService";
import { getProducts } from "../services/productService";

function BillingPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [items, setItems] = useState([{ product: "", quantity: 1 }]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ kind: "", message: "" });

  const canCreate = ["admin", "staff"].includes(user?.role);
  const canView = ["admin", "staff"].includes(user?.role);
  const canDelete = user?.role === "admin";

  const loadData = async () => {
    setLoading(true);
    try {
      const productResponse = await getProducts();
      setProducts(productResponse.data || []);

      if (canView) {
        const billResponse = await getBills();
        setBills(billResponse.data || []);
      }
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [canView]);

  const billPreviewAmount = useMemo(() => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p._id === item.product);
      if (!product) return sum;
      return sum + product.price * Number(item.quantity || 0);
    }, 0);
  }, [items, products]);

  const updateItem = (index, key, value) => {
    const clone = [...items];
    clone[index] = { ...clone[index], [key]: value };
    setItems(clone);
  };

  const addItem = () => setItems([...items, { product: "", quantity: 1 }]);

  const removeItem = (index) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleCreateBill = async (event) => {
    event.preventDefault();

    const payload = {
      items: items.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity),
      })),
    };

    try {
      const response = await createBill(payload);
      setStatus({ kind: "success", message: response.message || "Bill created successfully" });
      setItems([{ product: "", quantity: 1 }]);
      await loadData();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  const openBill = async (id) => {
    try {
      const response = await getBillById(id);
      setSelectedBill(response.data);
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  const removeBill = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    try {
      const response = await deleteBill(id);
      setStatus({ kind: "success", message: response.message || "Bill deleted" });
      setSelectedBill(null);
      await loadData();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  if (loading) {
    return <LoadingState label="Loading billing..." />;
  }

  return (
    <section>
      <PageHeader title="Billing" subtitle="Create and manage bills with automatic stock deduction." />
      <StatusBanner kind={status.kind} message={status.message} />

      {canCreate ? (
        <form className="panel" onSubmit={handleCreateBill}>
          <h3>Create Bill</h3>
          {items.map((item, index) => (
            <div key={index} className="form-grid compact-grid">
              <select
                value={item.product}
                onChange={(e) => updateItem(index, "product", e.target.value)}
                required
              >
                <option value="">Select product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} (Stock: {product.stock}, Price: {product.price})
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                required
              />
              {items.length > 1 ? (
                <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>
                  Remove
                </button>
              ) : null}
            </div>
          ))}
          <div className="actions-row billing-actions">
            <button type="button" className="btn btn-secondary" onClick={addItem}>
              Add Item
            </button>
            <button className="btn btn-primary" type="submit">
              Create Bill
            </button>
          </div>
          <p className="subtle-text">Estimated total: {billPreviewAmount.toFixed(2)}</p>
        </form>
      ) : null}

      {canView ? (
        <div className="panel">
          <h3>Bill List</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill Number</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.billNumber}</td>
                    <td>{bill.items?.length || 0}</td>
                    <td>{bill.totalAmount}</td>
                    <td>{bill.createdBy?.name || "-"}</td>
                    <td className="actions-row">
                      <button className="btn btn-secondary" onClick={() => openBill(bill._id)}>
                        View
                      </button>
                      {canDelete ? (
                        <button className="btn btn-danger" onClick={() => removeBill(bill._id)}>
                          Delete
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedBill ? (
            <div className="detail-card">
              <h4>Bill Details: {selectedBill.billNumber}</h4>
              <p>Total Amount: {selectedBill.totalAmount}</p>
              <ul className="detail-list">
                {selectedBill.items?.map((item, idx) => (
                  <li key={`${item.product?._id}-${idx}`}>
                    {item.product?.name || "Unknown"} - Qty: {item.quantity} - Price: {item.price} -
                    Subtotal: {item.subtotal}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default BillingPage;
