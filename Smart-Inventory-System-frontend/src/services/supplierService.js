import apiClient from "./apiClient";

export async function getSuppliers() {
  const { data } = await apiClient.get("/suppliers");
  return data;
}

export async function getSupplierById(id) {
  const { data } = await apiClient.get(`/suppliers/${id}`);
  return data;
}

export async function getSupplierProducts(id) {
  const { data } = await apiClient.get(`/suppliers/${id}/products`);
  return data;
}

export async function createSupplier(payload) {
  const { data } = await apiClient.post("/suppliers", payload);
  return data;
}

export async function updateSupplier(id, payload) {
  const { data } = await apiClient.patch(`/suppliers/${id}`, payload);
  return data;
}

export async function deleteSupplier(id) {
  const { data } = await apiClient.delete(`/suppliers/${id}`);
  return data;
}
