// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';

import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/admin/Dashboard';
import Clients from './pages/admin/Clients';
import Loans from './pages/admin/Loans';
import Repayments from './pages/admin/Repayments';
import Users from './pages/admin/Users';
import MyLoan from './pages/client/MyLoan';
import MySchedule from './pages/client/MySchedule';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={
        user
          ? <Navigate to={user.role === 'CLIENT' ? '/my-loan' : '/dashboard'} replace />
          : <Login />
      } />

      {/* Admin + Officer routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute roles={['ADMIN', 'LOAN_OFFICER']}>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/clients" element={
        <ProtectedRoute roles={['ADMIN', 'LOAN_OFFICER']}>
          <Layout><Clients /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/loans" element={
        <ProtectedRoute roles={['ADMIN', 'LOAN_OFFICER']}>
          <Layout><Loans /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/repayments" element={
        <ProtectedRoute roles={['ADMIN', 'LOAN_OFFICER']}>
          <Layout><Repayments /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute roles={['ADMIN']}>
          <Layout><Users /></Layout>
        </ProtectedRoute>
      } />

      {/* Client routes */}
      <Route path="/my-loan" element={
        <ProtectedRoute roles={['CLIENT']}>
          <Layout><MyLoan /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-schedule" element={
        <ProtectedRoute roles={['CLIENT']}>
          <Layout><MySchedule /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch-all redirect to Landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
