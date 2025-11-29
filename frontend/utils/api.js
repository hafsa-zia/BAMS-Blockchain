// frontend/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// ... all your existing exports (getDepartments, getClasses, etc.)

// ADD THIS at the bottom:
export const getValidationReport = () => API.get("/validate");
