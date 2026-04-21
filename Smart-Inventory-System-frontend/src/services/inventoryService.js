import apiClient from "./apiClient";

export async function addStock(payload) {
  const { data } = await apiClient.post("/inventory/add-stock", payload);
  return data;
}

export async function removeStock(payload) {
  const { data } = await apiClient.post("/inventory/remove-stock", payload);
  return data;
}

export async function getInventoryHistory() {
  const { data } = await apiClient.get("/inventory/history");
  return data;
}

export async function getProductInventory(productId) {
  const { data } = await apiClient.get(`/inventory/product/${productId}`);
  return data;
}

export async function getInventorySummary() {
  const { data } = await apiClient.get("/inventory/summary");
  return data;
}
