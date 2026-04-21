import apiClient from "./apiClient";

export async function createBill(payload) {
  const { data } = await apiClient.post("/bills", payload);
  return data;
}

export async function getBills() {
  const { data } = await apiClient.get("/bills");
  return data;
}

export async function getBillById(id) {
  const { data } = await apiClient.get(`/bills/${id}`);
  return data;
}

export async function deleteBill(id) {
  const { data } = await apiClient.delete(`/bills/${id}`);
  return data;
}
