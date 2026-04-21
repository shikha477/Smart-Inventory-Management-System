import apiClient from "./apiClient";

export async function getOverview() {
  const { data } = await apiClient.get("/analytics/overview");
  return data;
}

export async function getTopProducts() {
  const { data } = await apiClient.get("/analytics/top-products");
  return data;
}

export async function getMonthlySales() {
  const { data } = await apiClient.get("/analytics/monthly-sales");
  return data;
}

export async function getRevenue() {
  const { data } = await apiClient.get("/analytics/revenue");
  return data;
}

export async function getInventoryValue() {
  const { data } = await apiClient.get("/analytics/inventory-value");
  return data;
}
