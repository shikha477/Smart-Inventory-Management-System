import { useEffect, useMemo, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../services/apiClient";
import {
  createSupplier,
  deleteSupplier,
  getSuppliers,
  updateSupplier,
} from "../services/supplierService";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  address: "",
  isActive: true,
};

function SuppliersPage() {
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ kind: "", message: "" });

  const isAdmin = user?.role === "admin";

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getSuppliers();
      setSuppliers(response.data || []);
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const term = search.toLowerCase();
    return suppliers.filter((item) => {
      return (
        item.name?.toLowerCase().includes(term) ||
        item.company?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    });
  }, [suppliers, search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ kind: "", message: "" });

    try {
      if (editingId) {
        await updateSupplier(editingId, form);
        setStatus({ kind: "success", message: "Supplier updated successfully" });
      } else {
        await createSupplier(form);
        setStatus({ kind: "success", message: "Supplier created successfully" });
      }
      setEditingId("");
      setForm(initialForm);
      await loadData();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  const onEdit = (supplier) => {
    setEditingId(supplier._id);
    setForm({
      name: supplier.name || "",
      email: supplier.email || "",
      phone: supplier.phone || "",
      company: supplier.company || "",
      address: supplier.address || "",
      isActive: Boolean(supplier.isActive),
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      await deleteSupplier(id);
      setStatus({ kind: "success", message: "Supplier deleted successfully" });
      await loadData();
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    }
  };

  if (loading) {
    return <LoadingState label="Loading suppliers..." />;
  }

  return (
    <section>
      <PageHeader title="Suppliers" subtitle="Supplier management backed by supplier controller." />
      <StatusBanner kind={status.kind} message={status.message} />

      {isAdmin ? (
        <form className="panel form-grid" onSubmit={handleSubmit}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            Active supplier
          </label>
          <div className="actions-row">
            <button className="btn btn-primary" type="submit">
              {editingId ? "Update Supplier" : "Add Supplier"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn btn-secondary"
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
          <h3>Supplier list</h3>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name/company/email"
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                {isAdmin ? <th>Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.company || "-"}</td>
                  <td>{item.email || "-"}</td>
                  <td>{item.phone || "-"}</td>
                  <td>{item.isActive ? "Active" : "Inactive"}</td>
                  {isAdmin ? (
                    <td className="actions-row">
                      <button className="btn btn-secondary" onClick={() => onEdit(item)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => onDelete(item._id)}>
                        Delete
                      </button>
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

export default SuppliersPage;
