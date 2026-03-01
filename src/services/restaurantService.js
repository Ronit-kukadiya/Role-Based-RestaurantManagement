import { api } from "./api";

export async function getAllRestaurants() {
  const responce = await api.get("/restaurants/");
  return responce.data;
}

export async function insertRestaurants(data) {
  const response = await api.post("/restaurants", data);
  return response.data;
}

export async function updateRestaurants(id, data) {
  const response = await api.patch(`/restaurants/${id}`, data);
  return response.data;
}

export async function deleteRestaurants(id) {
  const response = await api.delete(`/restaurants/${id}`);
  return response.data;
}
