import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API,
  headers: { 'Content-Type': 'application/json' },
});

// Employee APIs
export const getEmployees = (params = {}) => api.get('/employees', { params });
export const getEmployee = (employeeId) => api.get(`/employees/${employeeId}`);
export const createEmployee = (data) => api.post('/employees', data);
export const deleteEmployee = (employeeId) => api.delete(`/employees/${employeeId}`);
export const getDepartments = () => api.get('/departments');

// Attendance APIs
export const markAttendance = (data) => api.post('/attendance', data);
export const getAttendance = (params = {}) => api.get('/attendance', { params });
export const getAttendanceSummary = (employeeId) => api.get(`/attendance/summary/${employeeId}`);

// Dashboard API
export const getDashboard = () => api.get('/dashboard');

export default api;
