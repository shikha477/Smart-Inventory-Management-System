import { useEffect, useState } from "react";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusBanner from "../components/StatusBanner";
import { getApiErrorMessage } from "../services/apiClient";
import {
  exportInventoryExcel,
  exportInventoryPdf,
  getInventoryReport,
  getLowStockReport,
  getSalesReport,
} from "../services/reportService";

function ReportPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ kind: "", message: "" });
  const [salesReport, setSalesReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [lowStockReport, setLowStockReport] = useState(null);
  const [exporting, setExporting] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setStatus({ kind: "", message: "" });

      try {
        const [salesResponse, inventoryResponse, lowStockResponse] = await Promise.all([
          getSalesReport(),
          getInventoryReport(),
          getLowStockReport(),
        ]);

        if (!active) return;

        setSalesReport(salesResponse);
        setInventoryReport(inventoryResponse);
        setLowStockReport(lowStockResponse);
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

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (type) => {
    setExporting(type);
    setStatus({ kind: "", message: "" });

    try {
      if (type === "pdf") {
        const response = await exportInventoryPdf();
        downloadBlob(response.data, "inventory-report.pdf");
      } else {
        const response = await exportInventoryExcel();
        downloadBlob(response.data, "inventory-report.xlsx");
      }

      setStatus({ kind: "success", message: `Inventory ${type.toUpperCase()} export started.` });
    } catch (err) {
      setStatus({ kind: "error", message: getApiErrorMessage(err) });
    } finally {
      setExporting("");
    }
  };

  if (loading) {
    return <LoadingState label="Loading reports..." />;
  }

  return (
    <section>
      <PageHeader title="Reports" subtitle="Sales, inventory, and stock alerts in one admin view." />
      <StatusBanner kind={status.kind} message={status.message} />

      <div className="cards-grid">
        <article className="data-card">
          <h3>Total Sales</h3>
          <p>{salesReport?.totalSales ?? 0}</p>
        </article>
        <article className="data-card">
          <h3>Total Revenue</h3>
          <p>{salesReport?.totalRevenue ?? 0}</p>
        </article>
        <article className="data-card">
          <h3>Inventory Items</h3>
          <p>{inventoryReport?.totalProducts ?? 0}</p>
        </article>
        <article className="data-card">
          <h3>Low Stock Items</h3>
          <p>{lowStockReport?.count ?? 0}</p>
        </article>
      </div>

      <div className="cards-grid two-col">
        <div className="panel">
          <h3>Export Inventory Report</h3>
          <p className="subtle-text">Download the current inventory snapshot as PDF or Excel.</p>
          <div className="actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => handleExport("pdf")}
              disabled={exporting === "pdf"}
            >
              {exporting === "pdf" ? "Exporting PDF..." : "Export PDF"}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleExport("excel")}
              disabled={exporting === "excel"}
            >
              {exporting === "excel" ? "Exporting Excel..." : "Export Excel"}
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>Low Stock Summary</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(lowStockReport?.products || []).map((item) => (
                  <tr key={item._id}>
                    <td>{item.product?.name || "Unknown"}</td>
                    <td>{item.quantity}</td>
                    <td>Low stock</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="cards-grid two-col">
        <div className="panel">
          <h3>Sales Report</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Created By</th>
                </tr>
              </thead>
              <tbody>
                {(salesReport?.sales || []).map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.billNumber}</td>
                    <td>{bill.items?.length || 0}</td>
                    <td>{bill.totalAmount}</td>
                    <td>{bill.createdBy?.name || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>Inventory Report</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {(inventoryReport?.inventory || []).map((item) => (
                  <tr key={item._id}>
                    <td>{item.product?.name || "Unknown"}</td>
                    <td>{item.quantity}</td>
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

export default ReportPage;