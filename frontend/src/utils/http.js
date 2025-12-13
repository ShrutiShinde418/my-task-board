import axios from "axios";
axios.defaults.withCredentials = true;
import { backendURLLocal } from "./helpers.js";

export const login = async (email, password) => {
  return await axios.post(
    `${backendURLLocal}/api/login`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const signup = async (email, password) => {
  return await axios.post(
    `${backendURLLocal}/api/signup`,
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const getUserDetails = async () => {
  return axios.get(`${backendURLLocal}/api/get/user/details`, {
    headers: { "Content-Type": "application/json" },
  });
};
