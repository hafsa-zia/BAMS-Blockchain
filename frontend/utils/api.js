// frontend/utils/api.js
import axios from "axios";
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Departments
export const getDepartments = () => API.get("/departments");
export const getDepartment = (id) => API.get(`/departments/${id}`);
export const createDepartment = (data) => API.post("/departments", data);
export const updateDepartment = (id, updates) => API.post(`/departments/${id}/update`, updates);
export const deleteDepartment = (id) => API.post(`/departments/${id}/delete`);

// Classes
export const getClasses = () => API.get("/classes");
export const getClassById = (id) => API.get(`/classes/${id}`);
export const createClass = (data) => API.post("/classes", data);
export const updateClass = (id, updates) => API.post(`/classes/${id}/update`, updates);
export const deleteClass = (id) => API.post(`/classes/${id}/delete`);

// Students
export const getStudents = () => API.get("/students");
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post("/students", data);
export const updateStudent = (id, updates) => API.post(`/students/${id}/update`, updates);
export const deleteStudent = (id) => API.post(`/students/${id}/delete`);
export const getStudentChain = (id) => API.get(`/students/${id}/chain`);

// Attendance
export const markAttendance = (studentId, payload) => API.post("/attendance/mark", { studentId, ...payload });
export const getAttendanceForStudent = (id) => API.get(`/attendance/student/${id}`);
export const getAttendanceForClassOnDate = (classId, date) => API.get(`/attendance/class/${classId}/day/${date}`);
