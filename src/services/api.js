import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const getUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

export const getDepartments = async () => {
  const response = await apiClient.get('/departments');
  return response.data;
};

export const getLeaveTypes = async () => {
  const response = await apiClient.get('/leave-types');
  return response.data;
};

export const getLeaveRequests = async (params = {}) => {
  const response = await apiClient.get('/leave-requests', { params });
  return response.data;
};

export const getLeaveRequestById = async (id) => {
  const response = await apiClient.get(`/leave-requests/${id}`);
  return response.data;
};

export const createLeaveRequest = async (requestData) => {
  const response = await apiClient.post('/leave-requests', requestData);
  return response.data;
};

export const updateLeaveRequest = async (id, requestData) => {
  const response = await apiClient.put(`/leave-requests/${id}`, requestData);
  return response.data;
};

export const approveLeaveRequest = async (id, approvedBy = 'Manager') => {
  const response = await apiClient.put(`/leave-requests/${id}/approve`, { approved_by: approvedBy });
  return response.data;
};

export const rejectLeaveRequest = async (id, approvedBy = 'Manager') => {
  const response = await apiClient.put(`/leave-requests/${id}/reject`, { approved_by: approvedBy });
  return response.data;
};

export const getLeaveBalance = async (employeeId) => {
  const response = await apiClient.get(`/leave-balance/${employeeId}`);
  return response.data;
};

export const getDashboardStats = async (employeeId) => {
  const response = await apiClient.get(`/dashboard/stats/${employeeId}`);
  return response.data;
};

export default apiClient;
