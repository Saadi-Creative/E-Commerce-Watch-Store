// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // SECURITY: Compare against the environment variable OR the hardcoded secure email
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'your-admin@example.com';

  // Check if current user matches the admin email
  const isAdmin = !!user && !!adminEmail && user.email?.toLowerCase().trim() === adminEmail.toLowerCase().trim();

  return { user, loading, isAdmin };
};
