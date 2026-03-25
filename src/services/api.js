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
export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (data) => api.post('/api/users', data),
  update: (id, data) => api.put(`/api/users/${id}`, data),
  remove: (id) => api.delete(`/api/users/${id}`),
  updateStatus: (id, status) => api.patch(`/api/users/${id}/status`, { status }),
};

export const clientsAPI = {
  getAll: (search) => api.get('/api/clients', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/api/clients/${id}`),
  create: (data) => api.post('/api/clients', data),
  update: (id, data) => api.put(`/api/clients/${id}`, data),
  remove: (id) => api.delete(`/api/clients/${id}`),
};

export const loansAPI = {
  getAll: () => api.get('/api/loans'),
  getById: (id) => api.get(`/api/loans/${id}`),
  getSchedule: (id) => api.get(`/api/loans/${id}/schedule`),
  getOverdue: () => api.get('/api/loans/overdue'),
  getByClient: (clientId) => api.get(`/api/loans/client/${clientId}`),
  getMyLoan: () => api.get('/api/loans/my'),
  create: (data) => api.post('/api/loans', data),
  updateStatus: (id, status) => api.patch(`/api/loans/${id}/status`, { status }),
};

export const repaymentsAPI = {
  getByLoan: (loanId) => api.get(`/api/repayments/loan/${loanId}`),
  getPending: (loanId) => api.get(`/api/repayments/loan/${loanId}/pending`),
  record: (data) => api.post('/api/repayments', data),
};

export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getOverdue: () => api.get('/api/dashboard/overdue'),
  getRecentLoans: () => api.get('/api/dashboard/recent-loans'),
};