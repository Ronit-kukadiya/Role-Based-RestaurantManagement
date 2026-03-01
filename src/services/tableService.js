import { api } from "./api";

export async function getAllTables() {
  const responce = await api.get("/tables/restaurants/1094");
  return responce.data;
}

export async function insertTable(data) {
  const response = await api.post("/tables", data);
  return response.data;
}

export async function updateTable(id, data) {
  const response = await api.patch(`/tables/${id}`, data);
  return response.data;
}

export async function deleteTable(id) {
  const response = await api.delete(`/tables/${id}`);
  return response.data;
}
