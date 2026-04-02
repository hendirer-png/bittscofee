/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Lazy loading components for faster initial page load
const Layout = lazy(() => import('./components/Layout'));
const Menu = lazy(() => import('./components/Menu'));
const Inventory = lazy(() => import('./components/Inventory'));
const Reports = lazy(() => import('./components/Reports'));
const Admin = lazy(() => import('./components/Admin'));
const ProductManagement = lazy(() => import('./components/ProductManagement'));
const CafeProfile = lazy(() => import('./components/CafeProfile'));
const TableManagement = lazy(() => import('./components/TableManagement'));
const PublicHome = lazy(() => import('./components/PublicHome'));
const Login = lazy(() => import('./components/Login'));
const OrderConfirmation = lazy(() => import('./components/OrderConfirmation'));
const Finance = lazy(() => import('./components/Finance'));
const Employees = lazy(() => import('./components/Employees'));

// Loading component for lazy fallbacks
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-fadeIn">
    <div className="w-12 h-12 border-4 border-[#6F4E37]/20 border-t-[#6F4E37] rounded-full animate-spin"></div>
    <p className="text-sm font-bold text-[#8C7B6E] animate-pulse">Menyiapkan halaman...</p>
  </div>
);

export default function App() {
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('bits_coffee_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('bits_coffee_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bits_coffee_user');
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/menu" element={<div className="p-4 md:p-8 max-w-7xl mx-auto"><Menu /></div>} />
        <Route path="/order-confirmation" element={<div className="p-4 md:p-8 max-w-7xl mx-auto"><OrderConfirmation /></div>} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Admin/Staff Routes */}
        <Route 
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* All staff can access POS/Admin dashboard */}
          <Route path="/admin" element={<Admin />} />
          
          {/* Only Admin can access these management pages */}
          {user?.role_name === 'Admin' ? (
            <>
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<CafeProfile />} />
              <Route path="/tables" element={<TableManagement />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/admin" replace />} />
          )}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}



