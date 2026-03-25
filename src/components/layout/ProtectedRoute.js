// src/components/layout/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'CLIENT') return <Navigate to="/my-loan" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
