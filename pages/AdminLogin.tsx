// src/pages/AdminLogin.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { Lock } from 'lucide-react';

// SECRET ADMIN PATH - Must match App.tsx
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'wh-secret-panel';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // We bring back 'user' so we can check if a non-admin is trying to log in
  const { isAdmin, user } = useAuth();

  // 1. Redirect if Admin
  useEffect(() => {
    if (isAdmin) {
      navigate(`/${ADMIN_PATH}/inventory`); // Redirect to Inventory (Better UX than Add Product)
    }
  }, [isAdmin, navigate]);

  // 2. If logged in successfully BUT not an admin, show error
  useEffect(() => {
    if (user && !isAdmin) {
      setError("Access Denied: You are logged in, but not as an Admin.");
    }
  }, [user, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect above will handle the redirect if successful
    } catch (error: any) {
      setError("Invalid Credentials.");
    }
  };

  // Prevent form flicker if already logged in as admin
  if (isAdmin) return null;

  const inputStyle = "w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 focus:outline-none transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-yellow-500/10 rounded-full">
            <Lock className="text-yellow-500" size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-8 tracking-wide">Admin Portal</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              required
              autoComplete="email"
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-400 text-sm mb-2 ml-1" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyle}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-transform transform hover:scale-[1.02] shadow-lg"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;