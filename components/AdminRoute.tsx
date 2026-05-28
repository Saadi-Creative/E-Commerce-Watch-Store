// src/components/AdminRoute.tsx
import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// SECRET ADMIN PATH - Must match App.tsx
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '';

const AdminRoute: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // 1. If NOT logged in at all, go to Admin Login
  if (!user) {
    return <Navigate to={`/${ADMIN_PATH}`} replace />;
  }

  // 2. If logged in BUT not an admin, show Access Denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500 p-8 rounded-lg text-center max-w-md shadow-2xl">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied 🔒</h1>
          <p className="text-gray-300 mb-2">You are logged in as:</p>
          <p className="text-white font-mono bg-black/50 p-2 rounded mb-6 border border-gray-700 break-all">
            {user.email}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            This account does not have administrative privileges.
          </p>

          {/* Fixed Button: Uses navigate instead of hard reload */}
          <button
            onClick={() => navigate('/')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded font-bold transition border border-gray-600"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    );
  }

  // 3. If Admin, render the page
  return <Outlet />;
};

export default AdminRoute;
