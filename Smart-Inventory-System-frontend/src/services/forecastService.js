import apiClient from "./apiClient";

export async function getAllForecast() {
  const { data } = await apiClient.get("/forecast/all");
  return data;
}

export async function getProductForecast(productId) {
  const { data } = await apiClient.get(`/forecast/${productId}`);
  return data;
}
