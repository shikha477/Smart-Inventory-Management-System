import apiClient from "./apiClient";

export async function getAllUsers() {
  const { data } = await apiClient.get("/users");
  return data;
}
