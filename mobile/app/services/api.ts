import axios from "axios";
import { getToken } from "../context/AuthContext";



const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.1.50:3000";

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});