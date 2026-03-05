import axios from "axios";
const REACT_APP_API_URL = "https://hrms-lite-api-production-0c07.up.railway.app/api"
const API_BASE_URL =
  REACT_APP_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Employees API
export const employeeAPI = {
  getAll: (config) => api.get("/fetch_employee/", config),
  getById: (id, config) => api.get(`/fetch_employee/${id}/`, config),
  create: (data) => api.post("/create_employee/", data),
  delete: (id) => api.delete(`/delete_employee/${id}/`),
};

// Attendance API
export const attendanceAPI = {
  getAll: (config) => api.get("/fetch_attendance/", config),
  getByEmployee: (employeeId, config) =>
    api.get(`/fetch_attendance/by_employee/?employee_id=${employeeId}`, config),
  create: (data) => api.post("/create_attendance/", data),
  delete: (id) => api.delete(`/delete_attendance/${id}/`),
};

export default api;
