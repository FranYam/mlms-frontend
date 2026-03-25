// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://mlms-backend-lat7.onrender.com',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mlms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('mlms_token');
      localStorage.removeItem('mlms_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
};

export const clientsAPI = {
  getAll: (search) => api.get('/clients', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  remove: (id) => api.delete(`/clients/${id}`),
};

export const loansAPI = {
  getAll: () => api.get('/loans'),
  getById: (id) => api.get(`/loans/${id}`),
  getSchedule: (id) => api.get(`/loans/${id}/schedule`),
  getOverdue: () => api.get('/loans/overdue'),
  getByClient: (clientId) => api.get(`/loans/client/${clientId}`),
  getMyLoan: () => api.get('/loans/my'),
  create: (data) => api.post('/loans', data),
  updateStatus: (id, status) => api.patch(`/loans/${id}/status`, { status }),
};

export const repaymentsAPI = {
  getByLoan: (loanId) => api.get(`/repayments/loan/${loanId}`),
  getPending: (loanId) => api.get(`/repayments/loan/${loanId}/pending`),
  record: (data) => api.post('/repayments', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getOverdue: () => api.get('/dashboard/overdue'),
  getRecentLoans: () => api.get('/dashboard/recent-loans'),
};

export default api;
