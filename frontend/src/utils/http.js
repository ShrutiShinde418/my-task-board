import axios from "axios";
axios.defaults.withCredentials = true;
import { backendURLLocal } from "./helpers.js";

export const login = async (email, password) => {
  return await axios.post(
    `${backendURLLocal}/login`,
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
    `${backendURLLocal}/signup`,
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
  return axios.get(`${backendURLLocal}/get/user/details`, {
    headers: { "Content-Type": "application/json" },
  });
};

export const handleMutation = async (httpMethod, url, params, requestBody) => {
  return await axios({
    baseURL: backendURLLocal,
    url: params ? `${url}/${params}` : url,
    method: httpMethod.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
    data: requestBody,
  });
};
