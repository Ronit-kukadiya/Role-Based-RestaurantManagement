import { api } from "./api";
export const loginService = async (data) => {
  const responce = await api.post("/users/login", data);
  if (!responce.data.error) {
    localStorage.setItem("token", responce.data.data.token);
    localStorage.setItem(
      "user",
      JSON.stringify(atob(responce.data.data.token.split(".")[1])),
    );
  }
  return responce.data;
};

export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUserData = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const getToken = () => {
  return JSON.parse(localStorage.getItem("token"));
};
