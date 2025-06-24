import axios, { type AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: process.env.NEXT_PUBLIC_API_V2_URL,
});

export const setAuth = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};
