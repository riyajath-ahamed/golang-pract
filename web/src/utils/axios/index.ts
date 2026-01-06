import axios from "axios";

// In development, use empty base URL so Vite proxy handles API requests
// In production, use VITE_API_URL environment variable
const BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

