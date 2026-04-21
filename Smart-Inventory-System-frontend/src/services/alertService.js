import apiClient from "./apiClient";

export async function getAllAlerts() {
  const { data } = await apiClient.get("/alerts");
  return data;
}

export async function getLowStockAlerts() {
  const { data } = await apiClient.get("/alerts/low-stock");
  return data;
}

export async function markAlertAsRead(id) {
  const { data } = await apiClient.patch(`/alerts/${id}/read`);
  return data;
}

export async function deleteAlert(id) {
  const { data } = await apiClient.delete(`/alerts/${id}`);
  return data;
}
