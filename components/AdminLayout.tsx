// src/components/AdminLayout.tsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { LayoutDashboard, PlusSquare, LogOut, ShieldCheck } from 'lucide-react';

// SECRET ADMIN PATH - Must match App.tsx
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate(`/${ADMIN_PATH}`);
  };

  const linkStyle = "flex items-center px-4 py-2 rounded-md transition-all duration-200";
  const activeLink = "bg-yellow-500 text-gray-900 font-bold shadow-lg transform scale-105";
  const inactiveLink = "text-gray-300 hover:bg-gray-800 hover:text-white";

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header / Navbar */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center py-4 space-y-4 md:space-y-0">

            {/* Logo / Title */}
            <div className="flex items-center space-x-3">
              <ShieldCheck className="text-yellow-500" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">Admin Panel</h1>
                <p className="text-xs text-gray-400">Secure Management Dashboard</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2 sm:space-x-4 w-full md:w-auto justify-center">
              <NavLink
                to={`/${ADMIN_PATH}/add`}
                className={({ isActive }) => `${linkStyle} ${isActive ? activeLink : inactiveLink}`}
              >
                <PlusSquare size={18} className="mr-2" />
                <span className="text-sm sm:text-base">Add Product</span>
              </NavLink>

              <NavLink
                to={`/${ADMIN_PATH}/inventory`}
                className={({ isActive }) => `${linkStyle} ${isActive ? activeLink : inactiveLink}`}
              >
                <LayoutDashboard size={18} className="mr-2" />
                <span className="text-sm sm:text-base">Inventory</span>
              </NavLink>

              <div className="h-6 w-px bg-gray-600 mx-2"></div>

              <button
                onClick={handleLogout}
                className="flex items-center text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2 rounded-md transition-colors font-medium text-sm"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
