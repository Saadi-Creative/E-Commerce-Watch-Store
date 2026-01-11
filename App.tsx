// src/App.tsx
import React, { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
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
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || 'wh-secret-panel';

// Loading Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Analytics />
          <ScrollToTop /> {/* New helper for scroll restoration */}
          <Suspense fallback={<PageLoader />}>
            <Routes>

              {/* === 1. CLIENT WEBSITE === */}
              <Route element={<MainLayout />}>
                <Route element={<ClientRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/confirmation/:method" element={<OrderConfirmation />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                </Route>
              </Route>

              {/* === 2. HIDDEN ADMIN PANEL (Secret URL) === */}
              <Route path={`/${ADMIN_PATH}`} element={<AdminLogin />} />

              <Route element={<AdminLayout />}>
                <Route element={<AdminRoute />}>
                  <Route path={`/${ADMIN_PATH}/add`} element={<AddProduct />} />
                  <Route path={`/${ADMIN_PATH}/inventory`} element={<ManageInventory />} />
                  <Route path={`/${ADMIN_PATH}/edit/:id`} element={<EditProduct />} />
                </Route>
              </Route>

              {/* === 3. CATCH-ALL 404 === */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
};

export default App;