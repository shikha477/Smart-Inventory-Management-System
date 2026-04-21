import apiClient from "./apiClient";

export async function getProducts() {
  const { data } = await apiClient.get("/products");
  return data;
}

export async function getProductById(id) {
  const { data } = await apiClient.get(`/products/${id}`);
  return data;
}

export async function createProduct(payload) {
  const { data } = await apiClient.post("/products", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await apiClient.patch(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await apiClient.delete(`/products/${id}`);
  return data;
}
