import apiClient from "./apiClient";

export async function getSalesReport() {
  const { data } = await apiClient.get("/reports/sales");
  return data;
}

export async function getInventoryReport() {
  const { data } = await apiClient.get("/reports/inventory");
  return data;
}

export async function getLowStockReport() {
  const { data } = await apiClient.get("/reports/low-stock");
  return data;
}

export async function exportInventoryPdf() {
  return apiClient.get("/reports/export/pdf", { responseType: "blob" });
}

export async function exportInventoryExcel() {
  return apiClient.get("/reports/export/excel", { responseType: "blob" });
}