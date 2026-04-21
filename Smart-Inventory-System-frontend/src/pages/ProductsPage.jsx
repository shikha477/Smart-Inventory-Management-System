import { useEffect, useMemo, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/apiClient";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";
import { getSuppliers } from "../services/supplierService";

const initialForm = {
  name: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  reorderLevel: 10,
  supplier: "",
};

function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState({ kind: "", message: "" });

  const canWrite = ["admin", "manager"].includes(user?.role);
  const canDelete = user?.role === "admin";

  const loadData = async () => {
    setLoading(true);
    try {
      const [productResponse, supplierResponse] = await Promise.all([
        getProducts(),
        getSuppliers(),
      ]);
      setProducts(productResponse.data || []);
      setSuppliers(supplierResponse.data || []);
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter((item) => {
      return (
        item.name?.toLowerCase().includes(term) ||
        item.category?.toLowerCase().includes(term) ||
        item.sku?.toLowerCase().includes(term)
      );
    });
  }, [products, search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ kind: "", message: "" });

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      reorderLevel: Number(form.reorderLevel),
      supplier: form.supplier || undefined,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setStatus({ kind: "success", message: "Product updated successfully" });
      } else {
        await createProduct(payload);
        setStatus({ kind: "success", message: "Product created successfully" });
      }
      setForm(initialForm);
      setEditingId("");
      await loadData();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  const onEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      price: product.price || 0,
      stock: product.stock || 0,
      reorderLevel: product.reorderLevel || 10,
      supplier: product.supplier?._id || "",
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      setStatus({ kind: "success", message: "Product deleted successfully" });
      await loadData();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  if (loading) {
    return <LoadingState label="Loading products..." />;
  }

  return (
    <section>
      <PageHeader
        title="Products"
        subtitle="Manage products using product controller routes and validation."
      />

      <StatusBanner kind={status.kind} message={status.message} />

      {canWrite ? (
        <form className="panel form-grid" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <input
            placeholder="Price"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
          <input
            placeholder="Reorder level"
            type="number"
            min="0"
            value={form.reorderLevel}
            onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })}
          />
          <select
            value={form.supplier}
            onChange={(e) => setForm({ ...form, supplier: e.target.value })}
          >
            <option value="">Select supplier (optional)</option>
            {suppliers.map((supplier) => (
              <option key={supplier._id} value={supplier._id}>
                {supplier.name}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="actions-row">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId ? (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setEditingId("");
                  setForm(initialForm);
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      ) : null}

      <div className="panel">
        <div className="panel-head">
          <h3>Product list</h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name/category/sku"
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Reorder</th>
                <th>Supplier</th>
                {canWrite ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{item.category || "-"}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.reorderLevel}</td>
                  <td>{item.supplier?.name || "-"}</td>
                  {canWrite ? (
                    <td className="actions-row">
                      <button className="btn btn-secondary" onClick={() => onEdit(item)}>
                        Edit
                      </button>
                      {canDelete ? (
                        <button className="btn btn-danger" onClick={() => onDelete(item._id)}>
                          Delete
                        </button>
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ProductsPage;
