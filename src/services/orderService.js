import { api } from "./api";

export async function getAllOrders() {
  const responce = await api.get("/tables/restaurants/1094");
  return responce.data;
}

export async function insertOrder(data) {
  const response = await api.post("/tables", data);
  return response.data;
}

export async function updateOrder(id, data) {
  const response = await api.patch(`/tables/${id}`, data);
  return response.data;
}

export async function deleteOrder(id) {
  const response = await api.delete(`/tables/${id}`);
  return response.data;
}
