// src/components/ClientRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// SECRET ADMIN PATH - Must match App.tsx
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '';

const ClientRoute: React.FC = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="text-white text-center mt-20">Loading...</div>;
  }

  // If user is Admin, force them to Admin Dashboard (secret path)
  if (isAdmin) {
    return <Navigate to={`/${ADMIN_PATH}/inventory`} replace />;
  }

  // If not Admin (Guest), allow access to Shop/Home
  return <Outlet />;
};

export default ClientRoute;
