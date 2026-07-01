// src/App.tsx
import React, { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/Toast';

// Layouts & Guards
import MainLayout from './components/MainLayout';
import ClientRoute from './components/ClientRoute';
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';

// Client Pages (Eager Loaded for Speed)
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';

// Lazy Loaded Pages (Load only when visited to speed up initial site load)
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmation = React.lazy(() => import('./pages/OrderConfirmation'));
const ReviewsPage = React.lazy(() => import('./pages/ReviewsPage'));
const MyOrders = React.lazy(() => import('./pages/MyOrders'));

// Admin Pages (Lazy Loaded - Regular users never download this code)
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AddProduct = React.lazy(() => import('./pages/AddProduct'));
const EditProduct = React.lazy(() => import('./pages/EditProduct'));
const ManageInventory = React.lazy(() => import('./pages/ManageInventory'));

// 404 Page
import NotFound from './pages/NotFound';

// SECRET ADMIN PATH - Read from environment variable
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '';

import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import PageTransition from './components/PageTransition';

// Loading Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* === 1. CLIENT WEBSITE === */}
        <Route element={<MainLayout />}>
          <Route element={<ClientRoute />}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
            <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
            <Route path="/product/:id" element={<PageTransition><ProductDetailsPage /></PageTransition>} />
            <Route path="/confirmation/:method" element={<PageTransition><OrderConfirmation /></PageTransition>} />
            <Route path="/reviews" element={<PageTransition><ReviewsPage /></PageTransition>} />
            <Route path="/my-orders" element={<PageTransition><MyOrders /></PageTransition>} />
          </Route>
        </Route>

        {/* === 2. HIDDEN ADMIN PANEL (Secret URL) === */}
        <Route path={`/${ADMIN_PATH}`} element={<PageTransition><AdminLogin /></PageTransition>} />

        <Route element={<AdminLayout />}>
          <Route element={<AdminRoute />}>
            <Route path={`/${ADMIN_PATH}/add`} element={<PageTransition><AddProduct /></PageTransition>} />
            <Route path={`/${ADMIN_PATH}/inventory`} element={<PageTransition><ManageInventory /></PageTransition>} />
            <Route path={`/${ADMIN_PATH}/edit/:id`} element={<PageTransition><EditProduct /></PageTransition>} />
          </Route>
        </Route>

        {/* === 3. CATCH-ALL 404 === */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ToastProvider>
        <CartProvider>
          <BrowserRouter>
            <Analytics />
            <ScrollToTop /> {/* New helper for scroll restoration */}
            <Suspense fallback={<PageLoader />}>
              <AnimatedRoutes />
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </ToastProvider>
    </HelmetProvider>
  );
};

export default App;
